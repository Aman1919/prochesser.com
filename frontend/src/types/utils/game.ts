/* eslint-disable @typescript-eslint/no-explicit-any */
import { Square } from "chess.js";
import { Piece } from "react-chessboard/dist/chessboard/types";
import { TColor } from "../game";

export const isPromotion = (targetSquare: Square, piece: Piece) => {
  if(!["wP", "bP"].includes(piece)) return false;
  const isWhitePawn = piece?.[0] === "w";
  const isBlackPawn = piece?.[0] === "b";

  const whitePromotionRank = "8";
  const blackPromotionRank = "1";
  if (
    (isWhitePawn && targetSquare[1] === whitePromotionRank) ||
    (isBlackPawn && targetSquare[1] === blackPromotionRank)
  ) {
    return true;
  }

  return false;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export function roundTo8Decimals(num: number) {
  return Number(num.toFixed(8));
}

export function isPlayerTurn(fen: string, playerColor: TColor): boolean {
  if(!playerColor) return false;
  const parts = fen.split(' ');
  const activeColor = parts[1];
  const color = playerColor === "white" ? "w" : "b";
  return activeColor === color;
}