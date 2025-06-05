import { useGameContext } from "src/context/gameContext";

const ButtonsWeb = () =>
{
  const {
    gameStarted,
    setGameStarted,
    restartGame,
    setShowConfirmModal,
    handleHintSelected,
    startNextRound,
    setBGMusicTime,
    handleLoad,
    handleSave,
    currentUser
  } = useGameContext();

  const handlePlay = () =>
  {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="gap-4 hidden lg:grid grid-cols-2 justify-center">
      <img
        src="assets/modal/buttons/Hint.png"
        alt="Hint"
        onClick={handleHintSelected}
        className="cursor-pointer hover:opacity-80 w-28 justify-self-center"
      />

      <img
        src={gameStarted ? 'assets/modal/buttons/playagain.png' : 'assets/modal/buttons/play.png'}
        alt="Restart"
        onClick={handlePlay}
        className="cursor-pointer hover:opacity-80 w-28 justify-self-center"
      />

      {currentUser && currentUser!.lastRound && <img
        src="assets/images/load_btn.png"
        alt="Load"
        onClick={() => currentUser!.lastRound && handleLoad()}
        className="cursor-pointer hover:opacity-80 w-28 justify-self-center"
      />
      }

      {gameStarted && <img
        src="assets/images/save_btn.png"
        alt="Save"
        onClick={() => gameStarted && handleSave()}
        className="cursor-pointer hover:opacity-80 w-28 justify-self-center"
      />}

      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={startNextRound}
      >
        Next
      </button> */}

      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={setBGMusicTime}
      >
        Set
      </button> */}
      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={handleHintSelected}
      >
        Hint
      </button> */}
      {/* <button
        className={`px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
          !gameStarted
            ? "bg-green-600 hover:bg-green-400"
            : "bg-[#2a2b3c] hover:bg-[#3a3b4c]"
        } text-white`}
        onClick={ ()=> gameStarted ? setShowConfirmModal(true) : handlePlay() }
      >
        {gameStarted ? "Restart" : "Play"}
      </button> */}
    </div>
  )
}

export default ButtonsWeb;