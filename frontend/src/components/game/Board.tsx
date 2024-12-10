import { Chessboard } from "react-chessboard";
import {
  IHighlightedSquares,
  useBoardStore,
} from "../../contexts/board.context";
import { useGameStore } from "../../contexts/game.context";
import { isPromotion } from "../../types/utils/game";
import {
  Piece,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { MOVE } from "../../constants";
import { Chess, Square } from "chess.js";
import { TMove } from "../../types/game";
import { useGlobalStore } from "../../contexts/global.context";
import { useEffect, useRef } from "react";
import { useBestMoveStore } from "../../contexts/bestMove.context";
import { BestMove } from "./BestMove";

export default function Board(props: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { board, color, socket, setBoard, isGameStarted } = useGameStore([
    "board",
    "isGameStarted",
    "color",
    "setBoard",
    "socket",
  ]);
  const {
    showPromotionDialog,
    highlightedSquares,
    selectedSquare,
    selectedPiece,
    promotionSquare,
    setShowPromotionDialog,
    setSelectedSquare,
    setSelectedPiece,
    setPromotionSquare,
    setHighlightedSquares,
  } = useBoardStore([
    "showPromotionDialog",
    "highlightedSquares",
    "selectedSquare",
    "selectedPiece",
    "promotionSquare",
    "setShowPromotionDialog",
    "setHighlightedSquares",
    "setSelectedSquare",
    "setSelectedPiece",
    "setPromotionSquare",
  ]);
  const { setBestMove, automateMoves, bestMove } = useBestMoveStore(["setBestMove", "automateMoves", "bestMove"]);
  const { setLoading } = props;
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);

  const sendMove = (move: TMove) => {
    try {
      const chess = new Chess(board);
      if (
        (chess.turn() === "w" && color === "black") ||
        (chess.turn() === "b" && color === "white")
      ) {
        alertPopUp({
          message: "Kindly wait for your turn",
          type: "error",
          showPopUp: true,
        });
        return;
      }
      chess.move(move);
      setBoard(chess.fen());
      if (isGameStarted) setLoading(true);
      socket?.send(
        JSON.stringify({
          type: MOVE,
          move,
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      alertPopUp({
        message: "Invalid move",
        type: "error",
        showPopUp: true,
      });
      return;
    }
  };

  useEffect(() => {
    if(automateMoves && bestMove) {
      setTimeout(() => {
        sendMove(bestMove)
      }, 500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automateMoves, bestMove])

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    // Note -> This will not run during promotion
    // Promotion is handled differently
    try {
      if (!isGameStarted) return false;
      sendMove({
        from: sourceSquare,
        to: targetSquare,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setBestMove(null);
    }
  };

  const makeAMove = (sourceSquare: Square, targetSquare: Square) => {
    try {
      if (selectedPiece && isPromotion(targetSquare, selectedPiece)) {
        // Show the Promotion Dialog
        setShowPromotionDialog(true);
        setPromotionSquare(targetSquare);
        return false;
      }
      sendMove({
        from: sourceSquare,
        to: targetSquare,
      });
      setSelectedSquare(null);
      setSelectedPiece(null);
      return true;
    } catch (error) {
      return false;
    } finally {
      setBestMove(null);
    }
  };

  const onSquareClick = (square: Square, piece?: Piece) => {
    if (selectedSquare) {
      // Make a move
      makeAMove(selectedSquare, square);
      setHighlightedSquares({});
    } else {
      const game = new Chess(board);
      const moves = game.moves({ square, verbose: true }) as TMove[];
      const newHighlightedSquares: IHighlightedSquares = {};

      moves.forEach((move) => {
        newHighlightedSquares[move.to] = {
          backgroundColor: "rgb(161 98 7 / 1)",
        };
      });

      setHighlightedSquares(newHighlightedSquares);
      setSelectedSquare(square);
      if (piece) setSelectedPiece(piece);
    }
  };

  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
      }}
      ref={boardRef}
    >
      <Chessboard
        position={board}
        showPromotionDialog={showPromotionDialog}
        promotionDialogVariant="modal"
        onDragOverSquare={(square) => {
          // Update the promotionSquare here
          if (selectedPiece && isPromotion(square, selectedPiece)) {
            setPromotionSquare(square);
          }
        }}
        onPieceDragBegin={(piece, sourceSquare) => {
          setSelectedPiece(piece);
          setSelectedSquare(sourceSquare);
        }}
        onPromotionPieceSelect={(piece?: PromotionPieceOption) => {
          if (!piece || !selectedSquare || !promotionSquare) {
            setShowPromotionDialog(false);
            return false;
          }
          try {
            const promotion = piece?.[1].toLowerCase();
            socket?.send(
              JSON.stringify({
                type: MOVE,
                move: {
                  from: selectedSquare,
                  to: promotionSquare,
                  promotion,
                },
              })
            );
            setPromotionSquare(null);
            return true;
          } catch (error) {
            console.log(error);
            return false;
          } finally {
            setShowPromotionDialog(false);
            setSelectedSquare(null);
            setSelectedPiece(null);
          }
        }}
        // boardWidth={500}
        onPieceDrop={onDrop}
        boardOrientation={color ?? "white"}
        onSquareClick={onSquareClick}
        customSquareStyles={highlightedSquares}
      />
      <BestMove boardRef={boardRef} />
    </div>
  );
}
