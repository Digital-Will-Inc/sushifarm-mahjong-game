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
  containerPadding: number;
  // Changed from fixed heights to ratios
  headerHeightRatio: number;
  bucketHeightRatio: number;
  gameInfoHeightRatio: number;
  hudGapRatio: number;
  cardBoardGapRatio: number;
  mobileBreakpoint: number;
  tabletBreakpoint: number;
  gridCols: number;
  gridRows: number;
  minComponentHeight: number;   // Minimum height for components
  maxComponentHeight: number;   // Maximum height for components
  sidebarWidthRatio: number;    // Width ratio for sidebar in landscape
  minSidebarWidth: number;      // Minimum sidebar width
  maxSidebarWidth: number;      // Maximum sidebar width
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

  useEffect(() =>
  {
    if (showCongrats)
    {
      wortal.showInterstitialAd('next', 'NextLevel');
    }
  }, [showCongrats]);

  // Updated layout configuration with landscape support
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    containerPadding: 8,
    // These ratios will scale based on screen size
    headerHeightRatio: 0.08,      // 8% of screen height
    bucketHeightRatio: 0.12,      // 12% of screen height
    gameInfoHeightRatio: 0.10,    // 10% of screen height
    hudGapRatio: 0.015,           // 1.5% of screen height
    cardBoardGapRatio: 0.02,      // 2% of screen width
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    gridCols: 10,
    gridRows: 10,
    minComponentHeight: 50,       // Minimum height to ensure usability
    maxComponentHeight: 120,      // Maximum height to prevent oversizing
    sidebarWidthRatio: 0.25,      // 25% of screen width for sidebar in landscape
    minSidebarWidth: 200,         // Minimum sidebar width
    maxSidebarWidth: 300,         // Maximum sidebar width
  });

  const [layout, setLayout] = useState({
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 500,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    containerWidth: 400,
    cardBoardWidth: 400,
    cardBoardHeight: 400,
    cardSize: 40,
    headerHeight: 70,
    bucketHeight: 100,
    gameInfoHeight: 80,
    hudGap: 12,
    cardBoardGap: 8,
    isMobile: true,
    isLandscape: false,
    sidebarWidth: 0,              // Width of sidebar in landscape mode
    useHorizontalLayout: false,   // Whether to use horizontal layout
  });

  const calculateOptimalLayout = () =>
  {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isMobile = screenWidth < layoutConfig.mobileBreakpoint;
    const isLandscape = screenWidth > screenHeight;

    // Determine if we should use horizontal layout (landscape with sufficient width)
    const useHorizontalLayout = isLandscape && screenWidth > 600; // Minimum width threshold

    // Calculate dynamic heights based on screen size and ratios
    const baseHeaderHeight = screenHeight * layoutConfig.headerHeightRatio;
    const baseBucketHeight = screenHeight * layoutConfig.bucketHeightRatio;
    const baseGameInfoHeight = screenHeight * layoutConfig.gameInfoHeightRatio;
    const baseHudGap = screenHeight * layoutConfig.hudGapRatio;
    const baseCardBoardGap = screenWidth * layoutConfig.cardBoardGapRatio;

    // Container dimensions
    const containerWidth = screenWidth - (layoutConfig.containerPadding * 2);
    const containerHeight = screenHeight - (layoutConfig.containerPadding * 2);

    // Apply min/max constraints to prevent components from being too small or too large
    const headerHeight = Math.max(
      layoutConfig.minComponentHeight,
      Math.min(layoutConfig.maxComponentHeight, baseHeaderHeight)
    );

    let bucketHeight;
    if (useHorizontalLayout)
    {
      // In landscape, bucket can use more of the available sidebar height
      const availableSidebarHeight = containerHeight - (layoutConfig.containerPadding * 2);
      const reservedForHeaderAndGameInfo = baseHeaderHeight + baseGameInfoHeight + (baseHudGap * 2);
      const availableForBucket = availableSidebarHeight - reservedForHeaderAndGameInfo;

      bucketHeight = Math.max(
        layoutConfig.minComponentHeight,
        Math.min(
          layoutConfig.maxComponentHeight * 1.2, // Allow larger max in landscape
          Math.min(baseBucketHeight * 1.8, availableForBucket * 0.4) // Use up to 40% of available space
        )
      );
    } else
    {
      bucketHeight = Math.max(
        layoutConfig.minComponentHeight,
        Math.min(layoutConfig.maxComponentHeight, baseBucketHeight)
      );
    }

    const gameInfoHeight = Math.max(
      layoutConfig.minComponentHeight,
      Math.min(layoutConfig.maxComponentHeight, baseGameInfoHeight)
    );

    // Ensure gaps are reasonable
    const hudGap = Math.max(8, Math.min(20, baseHudGap));
    const cardBoardGap = Math.max(4, Math.min(16, baseCardBoardGap));



    let cardBoardWidth, cardBoardHeight, sidebarWidth = 0;

    if (useHorizontalLayout)
    {
      // Landscape layout: sidebar on the right
      const baseSidebarWidth = screenWidth * layoutConfig.sidebarWidthRatio;
      sidebarWidth = Math.max(
        layoutConfig.minSidebarWidth,
        Math.min(layoutConfig.maxSidebarWidth, baseSidebarWidth)
      );

      // Available space for cardboard (subtract sidebar width and gaps)
      const availableWidth = containerWidth - sidebarWidth - (cardBoardGap * 3);
      const availableHeight = containerHeight - (cardBoardGap * 2);

      // Ensure we have positive dimensions
      const safeAvailableWidth = Math.max(200, availableWidth);
      const safeAvailableHeight = Math.max(200, availableHeight);

      cardBoardWidth = safeAvailableWidth;
      cardBoardHeight = safeAvailableHeight;
    } else
    {
      // Portrait layout: original vertical layout
      const totalHudHeight = headerHeight + bucketHeight + gameInfoHeight + (hudGap * 3);

      // Available space for cardboard
      const availableWidth = containerWidth - (cardBoardGap * 2);
      const availableHeight = containerHeight - totalHudHeight - (cardBoardGap * 2);

      // Ensure we have positive dimensions
      const safeAvailableWidth = Math.max(200, availableWidth);
      const safeAvailableHeight = Math.max(200, availableHeight);

      cardBoardWidth = safeAvailableWidth;
      cardBoardHeight = safeAvailableHeight;
    }

    // Calculate card size based on available cardboard space and grid
    const cardSizeByWidth = (cardBoardWidth * 0.95) / layoutConfig.gridCols;
    const cardSizeByHeight = (cardBoardHeight * 0.95) / layoutConfig.gridRows;

    // Use the smaller dimension to ensure cards fit properly
    const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);

    // Recalculate cardboard dimensions based on optimal card size
    const optimalCardBoardWidth = cardSize * layoutConfig.gridCols * 1.05;
    const optimalCardBoardHeight = cardSize * layoutConfig.gridRows * 1.05;

    // Use the optimal dimensions if they fit, otherwise use available space
    const finalCardBoardWidth = Math.min(optimalCardBoardWidth, cardBoardWidth);
    const finalCardBoardHeight = Math.min(optimalCardBoardHeight, cardBoardHeight);

    // Final card size adjustment based on actual cardboard dimensions
    const finalCardSizeByWidth = (finalCardBoardWidth * 0.95) / layoutConfig.gridCols;
    const finalCardSizeByHeight = (finalCardBoardHeight * 0.95) / layoutConfig.gridRows;
    const finalCardSize = Math.min(finalCardSizeByWidth, finalCardSizeByHeight);

    return {
      screenWidth,
      screenHeight,
      containerWidth,
      cardBoardWidth: Math.floor(finalCardBoardWidth),
      cardBoardHeight: Math.floor(finalCardBoardHeight),
      cardSize: Math.floor(Math.max(15, finalCardSize)),
      headerHeight: Math.floor(headerHeight),
      bucketHeight: Math.floor(bucketHeight),
      gameInfoHeight: Math.floor(gameInfoHeight),
      hudGap: Math.floor(hudGap),
      cardBoardGap: Math.floor(cardBoardGap),
      isMobile,
      isLandscape,
      sidebarWidth: Math.floor(sidebarWidth),
      useHorizontalLayout,
    };
  };

  useEffect(() =>
  {
    const handleResize = () =>
    {
      const newLayout = calculateOptimalLayout();
      setLayout(newLayout);
      setCardBoardWidth(newLayout.cardBoardWidth);
      setCardSize(newLayout.cardSize);
    };

    // Initial calculation
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
  }, [layoutConfig, setCardBoardWidth, setCardSize]);

  useEffect(() =>
  {
    if (cards.length === 0 && gameStarted && bucket.length === 0 && additionalSlots.length === 0)
    {
      const audio = new Audio('./assets/audio/win.wav');
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
      className="min-h-screen bg-cover text-white overflow-hidden"
      style={{
        backgroundImage: `url(assets/sushi/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <div className="absolute inset-0 bg-yellow-200/20"></div>

      {/* Responsive Layout Container - Always Centered */}
      <div
        className="relative z-10 flex h-full w-full items-center justify-center"
        style={{
          padding: `${layoutConfig.containerPadding}px`,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            flexDirection: layout.useHorizontalLayout ? 'row' : 'column',
            gap: layout.useHorizontalLayout ? `${layout.cardBoardGap}px` : '0px',
          }}
        >
          {layout.useHorizontalLayout ? (
            // Horizontal Layout (Landscape) - Centered
            <>
              {/* CardBoard Section - Left Side */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: `${layout.cardBoardWidth}px`,
                  height: `${layout.cardBoardHeight}px`,
                }}
              >
                <CardBoard />
              </div>

              {/* Sidebar - Right Side with Top and Bottom Sections */}
              <div
                className="flex flex-col justify-between flex-shrink-0"
                style={{
                  width: `${layout.sidebarWidth}px`,
                  height: `${layout.cardBoardHeight}px`, // Match cardboard height for perfect alignment
                }}
              >
                {/* Top Section - Header and Bucket */}
                <div
                  className="flex flex-col"
                  style={{
                    gap: `${layout.hudGap}px`,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      height: `${layout.headerHeight}px`,
                      width: '100%',
                    }}
                  >
                    <Header />
                  </div>

                  {/* Bucket */}
                  <div
                    style={{
                      height: `${layout.bucketHeight}px`,
                      width: '100%',
                    }}
                  >
                    <Bucket />
                  </div>
                </div>

                {/* Bottom Section - GameInfo */}
                <div
                  style={{
                    height: `${layout.gameInfoHeight}px`,
                    width: '100%',
                  }}
                >
                  <GameInfo />
                </div>
              </div>
            </>
          ) : (
            // Vertical Layout (Portrait) - Centered
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: `${layout.cardBoardWidth}px`,
                gap: `${layout.hudGap}px`,
              }}
            >
              {/* Header Section */}
              <div
                className="flex-shrink-0 w-full"
                style={{
                  height: `${layout.headerHeight}px`,
                }}
              >
                <Header />
              </div>

              {/* Bucket Section */}
              <div
                className="flex-shrink-0 w-full"
                style={{
                  height: `${layout.bucketHeight}px`,
                }}
              >
                <Bucket />
              </div>

              {/* CardBoard Section */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: `${layout.cardBoardWidth}px`,
                  height: `${layout.cardBoardHeight}px`,
                }}
              >
                <CardBoard />
              </div>

              {/* GameInfo Section */}
              <div
                className="flex-shrink-0 w-full"
                style={{
                  height: `${layout.gameInfoHeight}px`,
                }}
              >
                <GameInfo />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals and Overlays */}
      {showCongrats && (
        <>
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
