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

type LayoutConfig = {
  maxContainerWidth: number;
  containerPadding: number;
  headerHeight: number;
  bucketHeight: number;
  gameInfoHeight: number;
  hudGap: number;
  cardBoardGap: number;
  cardBoardMinSize: number;
  cardBoardMaxSize: number;
  mobileBreakpoint: number;
  tabletBreakpoint: number;
};

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

  // Optimized layout configuration
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    maxContainerWidth: 500,
    containerPadding: 8,
    headerHeight: 70,
    bucketHeight: 100,
    gameInfoHeight: 80,
    hudGap: 36,
    cardBoardGap: 10,
    cardBoardMinSize: 480,
    cardBoardMaxSize: 1200,
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
  });

  const [layout, setLayout] = useState({
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 500,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    containerWidth: 400,
    cardBoardSize: 750,
    cardSize: 150,
    isMobile: true,
    availableHeight: 600,
  });

  const calculateUnifiedLayout = () =>
  {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isMobile = screenWidth < layoutConfig.mobileBreakpoint;

    // Container width - centered with max width
    const containerWidth = Math.min(
      screenWidth - (layoutConfig.containerPadding * 2),
      layoutConfig.maxContainerWidth
    );

    // Calculate used height for HUD components
    const usedHeight =
      layoutConfig.headerHeight +
      layoutConfig.bucketHeight +
      layoutConfig.gameInfoHeight +
      layoutConfig.hudGap + // Zero gap between header-bucket
      (layoutConfig.cardBoardGap * 2) + // Gaps around cardboard
      (layoutConfig.containerPadding * 2);

    const availableHeight = screenHeight - usedHeight;

    // CardBoard size - maximize available space while keeping it square
    const maxCardBoardSize = Math.min(
      containerWidth - (layoutConfig.cardBoardGap * 2),
      availableHeight,
      layoutConfig.cardBoardMaxSize
    );

    const cardBoardSize = Math.max(maxCardBoardSize, layoutConfig.cardBoardMinSize);

    // Optimize card size for better board utilization
    const effectiveBoardSize = cardBoardSize * 0.85;
    const cardSize = Math.max(Math.floor(effectiveBoardSize / 10), isMobile ? 24 : 28);

    return {
      screenWidth,
      screenHeight,
      containerWidth,
      cardBoardSize,
      cardSize,
      isMobile,
      availableHeight,
    };
  };

  useEffect(() =>
  {
    const handleResize = () =>
    {
      const newLayout = calculateUnifiedLayout();
      setLayout(newLayout);
      setCardBoardWidth(newLayout.cardBoardSize);
      setCardSize(newLayout.cardSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    document.addEventListener('contextmenu', function (e)
    {
      e.preventDefault();
    });

    return () =>
    {
      window.removeEventListener("resize", handleResize);
    };
  }, [layoutConfig, setCardBoardWidth, setCardSize]);

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
    registerUser('local@player.com', 'Player');
  }, [registerUser]);

  const handleNextRound = () =>
  {
    setShowCongrats(false);
    startNextRound();
  };

  return (
    <div
      className="min-h-screen bg-cover text-white overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(assets/sushi/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: `${layoutConfig.containerPadding * 0.5}px ${layoutConfig.containerPadding}px`,
      }}
    >
      <div className="absolute inset-0 bg-yellow-200/20"></div>

      {/* Unified Vertical Layout Container */}
      <div
        className="relative z-10 flex flex-col h-screen w-full max-w-none justify-between"
        style={{
          width: '100%', // Full width
          maxWidth: `${layout.containerWidth}px`, // Centered with max width
          margin: '0 auto', // Center horizontally
          padding: '0', // No padding
        }}
      >

        {/* Unified HUD Section - Header + Bucket (Zero Gap) */}
        <div className="flex-shrink-0 w-full">
          {/* Header */}
          <div style={{
            height: `${layoutConfig.headerHeight}px`,
            position: 'sticky',
            top: '0',
            zIndex: 30,
          }}>
            <Header />
          </div>

          {/* Bucket - Seamlessly connected to Header */}
          <div
            style={{
              height: `${layoutConfig.bucketHeight}px`,
              marginTop: `${layoutConfig.hudGap}px` // Zero gap
            }}
          >
            <Bucket />
          </div>
        </div>

        {/* CardBoard - Maximized Square in Center */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div
            style={{
              width: `${layout.cardBoardSize}px`,
              height: `${layout.cardBoardSize}px`,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <CardBoard />
          </div>
        </div>

        {/* GameInfo - Compact Bottom HUD */}
        <div
          className="flex-shrink-0 w-full"
          style={{
            height: `${layoutConfig.gameInfoHeight}px`,
            position: 'sticky',
            bottom: '0',
            zIndex: 30,
          }}
        >
          <GameInfo />
        </div>

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
