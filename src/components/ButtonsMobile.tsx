import { useGameContext } from "src/context/gameContext";
import Tooltip from "src/components/Tooltip";

const ButtonsMobile = () =>
{
  const {
    gameStarted,
    setGameStarted,
    restartGame,
    handleHintSelected,
    handleSave,
    handleLoad,
    currentUser
  } = useGameContext();

  const handlePlay = () =>
  {
    setGameStarted(true);
    restartGame();
  };

  return (
    <div className="flex gap-3 lg:hidden justify-between px-2 py-3">
      {gameStarted && (
        <Tooltip text="Get a clue">
          <button
            onClick={handleHintSelected}
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#E0B0FF]/80 to-[#D8A2E8]/80 border border-white/20 shadow hover:from-[#D8A2E8] hover:to-[#E0B0FF] transition text-[#4A2C1A] font-semibold text-base backdrop-blur-sm"
          >
            💡 Hint
          </button>
        </Tooltip>
      )}

      <Tooltip text={gameStarted ? "Restart the game" : "Start playing"}>
        <button
          onClick={handlePlay}
          className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#8B4513]/90 via-[#704337]/90 to-[#5D2E1F]/90 border border-white/20 shadow hover:from-orange-400 hover:to-yellow-400 hover:text-[#4A2C1A] transition text-white font-semibold text-base backdrop-blur-sm"
        >
          {gameStarted ? "🔄 Play Again" : "▶️ Play"}
        </button>
      </Tooltip>

      {currentUser?.lastRound && (
        <Tooltip text="Continue">
          <button
            onClick={handleLoad}
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-orange-100/80 to-pink-100/80 border border-orange-300/40 shadow hover:from-orange-200 hover:to-pink-200 transition text-[#8B4513] font-semibold text-base backdrop-blur-sm"
          >
            ⬆️ Load
          </button>
        </Tooltip>
      )}

      {gameStarted && (
        <Tooltip text="Save progress">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-orange-200/80 to-pink-200/80 border border-pink-300/40 shadow hover:from-orange-300 hover:to-pink-300 transition text-[#8B4513] font-semibold text-base backdrop-blur-sm"
          >
            💾 Save
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default ButtonsMobile;
