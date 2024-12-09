import { INIT_GAME } from "../../../constants";
import { useChatStore } from "../../../contexts/auth";
import { useGameStore } from "../../../contexts/game.context";

const Random = () => {
  const {
    setIsGameStarted,
    setResult,
    socket,
    setColor,
    stake,
    setStake,
    gameTime,
    setGameTime,
  } = useGameStore([
    "setIsGameStarted",
    "setResult",
    "socket",
    "setColor",
    "stake",
    "setStake",
    "gameTime",
    "setGameTime",
  ]);
  useChatStore();

  const startGame = () => {
    if (!socket) return;
    setIsGameStarted(true);
    setResult(null);
    setColor(null);
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  return (
    <div className=" w-full rounded-lg shadow-lg  mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="w-[49%]">
          <label className="block text-white text-sm font-medium mb-1">
            Enter Stake
          </label>
          <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
            <span className="bg-gray-200 px-3 py-2 text-black font-semibold border-r border-gray-400">
              $
            </span>
            <input
              type="text"
              className="flex-1 p-2 text-black outline-none focus:ring-2 focus:ring-yellow-500"
              value={stake}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setStake(Number(value));
                }
              }}
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="w-[49%]">
          <label className="block text-white text-sm font-medium mb-1">
            Select Game Time
          </label>
          <select
            value={gameTime}
            onChange={(e) => setGameTime(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-yellow-500"
          >
            <option value={300}>5 min</option>
            <option value={600}>10 min</option>
          </select>
        </div>
      </div>
      <button
        disabled={!socket}
        onClick={startGame}
        className={`w-full mt-5 py-2 px-4 rounded-lg font-semibold transition-all duration-150
          ${
            socket
              ? "bg-yellow-700 text-gray-100 hover:bg-yellow-600 focus:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
              : "bg-gray-500 cursor-not-allowed text-gray-400"
          }`}
      >
        Play
      </button>
    </div>
  );
};

export default Random;
