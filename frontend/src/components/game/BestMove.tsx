import usePersonStore from "../../contexts/auth";
import { useBestMoveStore } from "../../contexts/bestMove.context";
import { squareToCoords } from "../../types/utils/stockfish";

export const BestMove = ({
  boardRef,
}: {
  boardRef: React.RefObject<HTMLDivElement>;
}) => {
  const user = usePersonStore((state) => state.user);

  const { bestMove } = useBestMoveStore(["bestMove"]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawArrow = ({ from, to, color }: any, scale: any) => {
    const [fromX, fromY] = squareToCoords(from, color);
    const [toX, toY] = squareToCoords(to, color);

    const startX = fromX * scale;
    const startY = (8 - fromY) * scale;
    const endX = toX * scale;
    const endY = (8 - toY) * scale;

    return (
      <line
        key={`${from}-${to}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color ?? "blue"}
        strokeWidth={4}
        markerEnd="url(#arrowhead)"
      />
    );
  };

  if (!user || user?.role !== "ADMIN") return null;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
      {bestMove &&
        boardRef?.current?.offsetWidth &&
        drawArrow(bestMove, (boardRef?.current?.offsetWidth ?? 0) / 8 || 0)}
    </svg>
  );
};
