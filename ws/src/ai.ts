import { Chess, Move } from "chess.js";
import { Engine } from "node-uci";
import path from "path";
const pawnEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

const bishopEvalWhite = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

const rookEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

const evalQueen = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

const kingEvalWhite = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

const reverseArray = function (array: number[][]) {
  return array.slice().reverse();
};

const pawnEvalBlack = reverseArray(pawnEvalWhite);
const rookEvalBlack = reverseArray(rookEvalWhite);
const bishopEvalBlack = reverseArray(bishopEvalWhite);
const kingEvalBlack = reverseArray(kingEvalWhite);

export default class ChessAI {
  private positionCount = 0;
  private depth = 3;
  private stockfishEngine: Engine | null = null;
  constructor() {
    try {
      const stockfishPath = path.resolve(process.cwd(), "engine/stockfish");
      console.log("Stockfish binary path:", stockfishPath);
  
      // Ensure the path is passed to the Engine correctly
      this.stockfishEngine = new Engine(stockfishPath);
      console.log("Engine successfully initialized.");
    } catch (error) {
      console.error("Error initializing the Stockfish engine:", error);
    }
  }

  //getting move using stockfish engine
  public async getStockfishMove(game: Chess) {
    try{
      if (!this.stockfishEngine) {
        console.warn("Stockfish engine is not initialized.");
        return null;
      }
    
      await this.startEngine();
    
      const fen = game.fen();
      this.setSkillLevel("2");
    
      await this.stockfishEngine.position(fen);
    
      const moveTimeMs = (Math.floor(Math.random() * 5) + 1) * 1000;
    // Pm733gERhg45yJVnR4
      const result = await this.stockfishEngine.go({ movetime: moveTimeMs });
      const bestMove = result?.bestmove; 
    
      if (!bestMove) {
        this.stopEngine();
        throw new Error("No move found by Stockfish.");
      }
    
      const moves = game.moves({ verbose: true });
      const move = moves.find(
        (m) => m.from === bestMove.slice(0, 2) && m.to === bestMove.slice(2, 4)
      );
    
      this.stopEngine();
    
      if (!move) {
        throw new Error(`No legal move found matching Stockfish's suggestion: ${bestMove}`);
      }
    
      return move;
    }catch(e){
console.log("Error Stockfish Move",e);
return null
    }
  }
  

  async startEngine() {
    try {
      if (!this.stockfishEngine) return;
      await this.stockfishEngine.init();
      await this.stockfishEngine.isready();
      await this.stockfishEngine.ucinewgame();
    } catch (e) {
      console.log("error starting Engine", e);
    }
  }

  async stopEngine() {
    // Quit the engine
    await this.stockfishEngine?.quit();
  }

  // Best Move using minmax and apha-purning algorithm: an alternate method
  public getBestMove(game: Chess): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const moves = game.moves({ verbose: true });
        console.log("move length", moves.length);

        if (moves.length === 0) {
          resolve(null); // No valid moves
          return;
        }

        let bestMove = -9999;
        let bestMoveFound;

        for (const move of moves) {
          game.move(move);
          const value = this.minimax(
            this.depth - 1,
            game,
            -10000,
            10000,
            false
          );
          game.undo();
          if (value > bestMove) {
            bestMove = value;
            bestMoveFound = move;
          }
        }

        console.log("bestMoveFound", bestMoveFound);
        resolve(bestMoveFound || null); // Resolve with the best move or null if not found
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
        return null;
      }
    });
  }


  async setSkillLevel(skillLevel: string) {
    // Set the skill level (0-20 for Stockfish)
    await this.stockfishEngine?.setoption("Skill Level", skillLevel);
  }

  private minimax(
    depth: number,
    game: Chess,
    alpha: number,
    beta: number,
    isMaximisingPlayer: boolean
  ): number {
    this.positionCount++;
    if (depth === 0) {
      return -this.evaluateBoard(game.board());
    }

    const moves = game.moves({ verbose: true });
    if (isMaximisingPlayer) {
      let maxEval = -9999;
      for (const move of moves) {
        game.move(move);
        const evalValue = this.minimax(depth - 1, game, alpha, beta, false);
        game.undo();
        maxEval = Math.max(maxEval, evalValue);
        alpha = Math.max(alpha, evalValue);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = 9999;
      for (const move of moves) {
        game.move(move);
        const evalValue = this.minimax(depth - 1, game, alpha, beta, true);
        game.undo();
        minEval = Math.min(minEval, evalValue);
        beta = Math.min(beta, evalValue);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  private evaluateBoard(board: any[][]): number {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        totalEvaluation += this.getPieceValue(board[i][j], i, j);
      }
    }
    return totalEvaluation;
  }

  private getPieceValue(piece: any, x: number, y: number): number {
    if (!piece) return 0;
    const isWhite = piece.color === "w";
    switch (piece.type) {
      case "p":
        return isWhite ? pawnEvalWhite[x][y] : pawnEvalBlack[x][y];
      // Add other cases for other pieces.
      case "r":
        return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
      case "n":
        return 30 + knightEval[y][x];
      case "b":
        return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
      case "q":
        return 90 + evalQueen[y][x];
      case "k":
        return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
      default:
        throw "Unknown piece type: " + piece.type;
    }
  }
}
