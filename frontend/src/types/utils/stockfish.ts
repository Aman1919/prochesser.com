/* eslint-disable @typescript-eslint/no-explicit-any */
import { TMove } from "../game";

export const getBestMove = async (
  fen: string,
  depth: number = 10
): Promise<TMove> => {
  return new Promise((resolve, reject) => {
    if (!fen) {
      reject(new Error("FEN string is required"));
      return;
    }

    const stockfishWorker = new Worker("/stockfish.js");

    stockfishWorker.onmessage = (event: MessageEvent) => {
      const output = event.data;

      if (output.startsWith("bestmove")) {
        const parts = output.split(" ");
        const bestMove = parts[1]; // e.g., "e2e4"

        if (bestMove && bestMove.length === 4) {
          const move: TMove = {
            from: bestMove.slice(0, 2), // e.g., "e2"
            to: bestMove.slice(2, 4), // e.g., "e4"
          };
          resolve(move);
        } else {
          reject(new Error("Invalid move format"));
        }

        stockfishWorker.terminate(); // Terminate after processing
      }
    };

    stockfishWorker.onerror = (error) => {
      stockfishWorker.terminate();
      reject(error);
    };

    // Initialize Stockfish and send commands
    stockfishWorker.postMessage("uci");
    stockfishWorker.postMessage(`position fen ${fen}`);
    stockfishWorker.postMessage(`go depth ${depth}`); // Set depth dynamically
  });
};

export const squareToCoords = (square: any, color: string) => {
  const files = 'abcdefgh';
  const ranks = '12345678';

  if (color === 'white') {
    return [
      files.indexOf(square[0]) + 0.5, // X-coordinate (file)
      ranks.indexOf(square[1]) + 0.5, // Y-coordinate (rank)
    ];
  } else {
    return [
      7.5 - files.indexOf(square[0]), // Flip X-coordinate (file)
      7.5 - ranks.indexOf(square[1]), // Flip Y-coordinate (rank)
    ];
  }
};