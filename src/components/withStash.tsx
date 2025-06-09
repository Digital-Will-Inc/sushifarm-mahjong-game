import { useState, useEffect, useRef } from "react";
import { useGameContext } from "src/context/gameContext";
import { User } from "src/types/type";

const GameBoard = () =>
{
  const {
    currentRound,
    bucket,
    additionalSlots,
    lives,
    score,
    cards,
    leaderBoard,
    slotAvailablity,
    cardBoardWidth,
    rollbackAvailable,
    rollbackPressed,
    handleCardClick,
    moveToAdditionalSlots,
    rollbackFromAdditionalSlots,
    restartGame,
    registerUser,
    startNextRound,
    handleAdditionalCardClick,
    setCardBoardWidth,
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [_user, setUserName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() =>
  {
    const handleResize = () =>
    {
      const minSize = Math.min(window.innerWidth, window.innerHeight);
      minSize <= 750
        ? setCardBoardWidth(minSize - 50)
        : setCardBoardWidth(700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() =>
  {
    if (cards.length === 0 && gameStarted && bucket.length === 0 && additionalSlots.length === 0)
    {
      setShowCongrats(true);
    }
  }, [cards, bucket, additionalSlots]);

  const handleNextRound = () =>
  {
    setShowCongrats(false);
    startNextRound();
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    setUserName(event.target.value);
  };

  const changeUserName = async () =>
  {
    if (!_user.trim()) return;
    setModalOpen(false);
    setCurrentUser(_user);
  };

  const handlePlay = () =>
  {
    setGameStarted(true);
    restartGame();
  }
};

export default GameBoard;
