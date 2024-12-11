import { useEffect } from "react";
import usePersonStore from "../../contexts/auth";
import { useBestMoveStore } from "../../contexts/bestMove.context";
import { useGameStore } from "../../contexts/game.context";
import { getBestMove } from "../../types/utils/stockfish";
import { isPlayerTurn } from "../../types/utils/game";

const SuggestMoves = () => {
  const { board, isGameStarted, color } = useGameStore(["board", "isGameStarted", "color"]);
  const user = usePersonStore((state) => state.user);

  const { bestMove, setBestMove, loading, setLoading, automateMoves, setAutomateMoves } = useBestMoveStore([
    "bestMove",
    "setBestMove",
    "loading",
    "setLoading",
    "automateMoves", 
    "setAutomateMoves"
  ]);

  const suggestMoves = async () => {
    if (!board) {
      alert("Please enter a valid FEN string.");
      return;
    }

    setLoading(true);
    try {
      const move = await getBestMove(board);
      setBestMove(move);
    } catch (error) {
      console.error("Error analyzing FEN:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const suggestMoves2 = async () => {
      if (!board) {
        alert("Please enter a valid FEN string.");
        return;
      }
  
      setLoading(true);
      try {
        const move = await getBestMove(board);
        setBestMove(move);
      } catch (error) {
        console.error("Error analyzing FEN:", error);
      } finally {
        setLoading(false);
      }
    };
    if(isPlayerTurn(board, color)) suggestMoves2()
  }, [board, color, setBestMove, setLoading])

  if(!user || user?.role === "USER") return null;
  if (!isGameStarted) return null;

  return (
    <>
      <button
        onClick={suggestMoves}
        className="text-white border-white border m-2 p-2"
      >
        {loading ? "Analyzing..." : "Get Best Move"}
      </button>

      <button
        onClick={() => {
          setAutomateMoves(!automateMoves)
        }}
        className="text-white border-white border m-2 p-2"
      >
        {automateMoves ? "Stop Automation" : "Automate Moves"}
      </button>

      {bestMove && bestMove?.from && bestMove?.to && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="font-medium text-green-700">
            Suggested Move:{" "}
            <span className="font-bold">
              From {bestMove.from} to {bestMove.to}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default SuggestMoves;
