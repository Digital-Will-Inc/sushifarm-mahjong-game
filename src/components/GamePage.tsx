import { useState, useEffect, useRef } from "react";
import { useGameContext } from "src/context/gameContext";
import { useWortal } from "src/context/wortalContext";
import
{
  CardBoard,
  GameInfo,
  Bucket,
  LeaderBoard,
  Header,
  CongratesModal,
  FailedModal,
  ConfirmModal,
  ChangeName,
  GuideModal,
  Settings,
  HowToPlay
} from './index'

const GameBoard = () =>
{
  const {
    bucket,
    gameStarted,
    additionalSlots,
    cards,
    gameOver,
    showConfirmModal,
    currentUser,
    showEditModal,
    soundOff,
    showSettingsModal,
    showGuide,
    loading,
    setCardSize,
    setShowGuide,
    setShowSettingsModal,
    registerUser,
    restartGame,
    startNextRound,
    setCardBoardWidth,
    fetchLeaderboard,
    cardBoardWidth
  } = useGameContext();

  const wortal = useWortal();

  const [showCongrats, setShowCongrats] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  // Responsive breakpoints
  const getDeviceType = (width: number, height: number) =>
  {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    return { isMobile, isTablet, isDesktop };
  };

  // Calculate responsive dimensions
  const calculateDimensions = () =>
  {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceType = getDeviceType(width, height);

    let cardBoardSize;
    let cardSize;

    if (deviceType.isMobile)
    {
      // Mobile: Use most of the screen width with padding
      cardBoardSize = Math.min(width - 32, height * 0.6);
      cardSize = Math.max(Math.floor(cardBoardSize / 12), 35);
    } else if (deviceType.isTablet)
    {
      // Tablet: Balanced approach
      cardBoardSize = Math.min(width * 0.7, height * 0.7, 600);
      cardSize = Math.max(Math.floor(cardBoardSize / 10), 45);
    } else
    {
      // Desktop: Fixed size with good proportions
      cardBoardSize = Math.min(width * 0.45, height * 0.8, 700);
      cardSize = Math.max(Math.floor(cardBoardSize / 9), 50);
    }

    return {
      width,
      height,
      cardBoardSize,
      cardSize,
      ...deviceType
    };
  };

  useEffect(() =>
  {
    const handleResize = () =>
    {
      const newDimensions = calculateDimensions();
      setDimensions(newDimensions);
      setCardBoardWidth(newDimensions.cardBoardSize);
      setCardSize(newDimensions.cardSize);
    };

    // Initial setup
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Prevent context menu
    document.addEventListener('contextmenu', function (e)
    {
      e.preventDefault();
    });

    return () =>
    {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCardBoardWidth, setCardSize]);

  useEffect(() =>
  {
    if (cards.length === 0 && gameStarted && bucket.length === 0 && additionalSlots.length === 0)
    {
      const audio = new Audio('/assets/audio/win.wav');
      !soundOff && audio.play();
      setShowCongrats(true);
    }
  }, [cards, bucket, additionalSlots, gameStarted, soundOff]);

  useEffect(() =>
  {
    // Initialize the game with a default user
    registerUser('local@player.com', 'Player');
  }, [registerUser]);

  const handleNextRound = () =>
  {
    setShowCongrats(false);
    startNextRound();
  };

  // Responsive layout classes
  const getLayoutClasses = () =>
  {
    if (dimensions.isMobile)
    {
      return {
        container: "flex flex-col gap-3 p-4 min-h-screen",
        gameArea: "flex flex-col gap-4 items-center justify-center flex-1",
        sidePanel: "w-full"
      };
    } else if (dimensions.isTablet)
    {
      return {
        container: "flex flex-col gap-4 p-6 min-h-screen",
        gameArea: "flex flex-col gap-6 items-center justify-center flex-1",
        sidePanel: "w-full max-w-md mx-auto"
      };
    } else
    {
      return {
        container: "flex flex-row gap-6 p-8 min-h-screen justify-center items-center",
        gameArea: "flex flex-col gap-4 items-center",
        sidePanel: "flex flex-col gap-4 min-w-[320px] max-w-[400px]"
      };
    }
  };

  const layoutClasses = getLayoutClasses();

  return (
    <div
      className="min-h-screen bg-cover text-white"
      style={{
        backgroundImage: `url(assets/sushi/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-yellow-200/20"></div>

      {/* Main game container */}
      <div className={`relative z-10 ${layoutClasses.container}`}>
        {/* Mobile/Tablet Layout */}
        {(dimensions.isMobile || dimensions.isTablet) && (
          <div className={layoutClasses.gameArea}>
            <Header />
            <div className="relative">
              <CardBoard />
            </div>
            <div className={layoutClasses.sidePanel}>
              <GameInfo />
              <Bucket />
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        {dimensions.isDesktop && (
          <>
            {/* Left Section: Game Board */}
            <div className={layoutClasses.gameArea}>
              <div className="relative">
                <CardBoard />
              </div>
            </div>

            {/* Right Section: Game Info and Controls */}
            <div className={layoutClasses.sidePanel}>
              <Header />
              <GameInfo />
              <Bucket />
              <div className="flex-1 flex flex-col justify-end">
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals and Overlays */}
      {showCongrats && (
        <>
          {wortal.showInterstitialAd('next', 'NextLevel')}
          <CongratesModal handleClick={handleNextRound} />
        </>
      )}

      {gameOver && <FailedModal handleClick={restartGame} />}
      {showConfirmModal && gameStarted && <ConfirmModal />}
      {showGuideModal && <GuideModal />}
      {showEditModal && <ChangeName />}
      {showSettingsModal && <Settings />}
      {showGuide && <HowToPlay />}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white border-dashed rounded-full animate-spin"></div>
            <p className="text-white/80 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;