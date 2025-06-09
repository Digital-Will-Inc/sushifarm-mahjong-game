import { useGameContext } from "src/context/gameContext";
import ProgressBorder from "src/components/ProgressBorder";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const CardBoard = () =>
{
  const {
    cards,
    topCards,
    hintCards,
    isHint,
    cardBoardWidth,
    layerNumber,
    currentRound,
    resetHintCards,
    handleCardClick,
    gameStarted,
    gameRestarted,
    progressBorderSettings,
    setGameStarted,
    restartGame
  } = useGameContext();

  // Simplified progress tracking
  const [initialCardCount, setInitialCardCount] = useState(0);
  const gameStateRef = useRef({ roundNumber: -1, gameStarted: false });

  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    containerSize: cardBoardWidth + 40,
    boardSize: cardBoardWidth,
    isMobile: false
  });

  // Update dimensions when cardBoardWidth changes or window resizes
  useEffect(() =>
  {
    const updateDimensions = () =>
    {
      const isMobile = window.innerWidth < 768;
      const availableWidth = window.innerWidth - 32; // Account for padding
      const availableHeight = window.innerHeight - 200; // Account for header/footer

      // Calculate responsive size
      let containerSize = cardBoardWidth + 40;
      let boardSize = cardBoardWidth;

      if (isMobile)
      {
        // On mobile, use 90% of available space
        const maxSize = Math.min(availableWidth, availableHeight) * 0.9;
        if (containerSize > maxSize)
        {
          containerSize = maxSize;
          boardSize = containerSize - 40;
        }
      } else
      {
        // On larger screens, ensure it fits within viewport
        const maxSize = Math.min(availableWidth * 0.6, availableHeight * 0.8);
        if (containerSize > maxSize)
        {
          containerSize = maxSize;
          boardSize = containerSize - 40;
        }
      }

      setDimensions({
        containerSize: Math.max(containerSize, 300), // Minimum size
        boardSize: Math.max(boardSize, 260),
        isMobile
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [cardBoardWidth]);

  // Track initial count more reliably
  useEffect(() =>
  {
    const currentState = {
      roundNumber: currentRound?.roundNumber || 0,
      gameStarted: gameStarted || gameRestarted
    };

    const shouldSetInitialCount =
      (currentState.gameStarted && !gameStateRef.current.gameStarted) ||
      (currentState.roundNumber !== gameStateRef.current.roundNumber) ||
      (cards.length > 0 && initialCardCount === 0);

    if (shouldSetInitialCount)
    {
      setInitialCardCount(cards.length);
    }

    gameStateRef.current = currentState;
  }, [gameStarted, gameRestarted, currentRound?.roundNumber, cards.length, initialCardCount]);

  // Confetti on win
  useEffect(() =>
  {
    if (cards.length === 0 && initialCardCount > 0)
    {
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.6 },
        startVelocity: 30,
        gravity: 0.8,
        ticks: 200,
        scalar: 1.2,
        zIndex: 9999,
      });
    }
  }, [cards.length, initialCardCount]);

  // Calculate progress
  const progress = initialCardCount > 0 ? Math.max(0, 1 - (cards.length / initialCardCount)) : 0;

  const handlePlayClick = () =>
  {
    setGameStarted(true);
    restartGame();
  };

  // Scale factor for responsive card positioning
  const scaleFactor = dimensions.boardSize / cardBoardWidth;

  // -- HINT MODE --
  if (isHint)
  {
    return (
      <div className="relative mx-auto flex items-center justify-center min-h-[300px]"
        style={{ width: dimensions.containerSize, height: dimensions.containerSize }}>

        {/* Enhanced Progress Border */}
        {progress > 0 && (
          <ProgressBorder
            progress={progress}
            size={dimensions.containerSize}
            strokeWidth={dimensions.isMobile ? 12 : 20}
            color="#00CFFF"
            borderRadius={36}
            variant="pulse"
            position="behind"
          />
        )}

        <div
          className="absolute bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-3xl shadow-2xl overflow-hidden border-2 border-white/20"
          style={{
            width: dimensions.boardSize,
            height: dimensions.boardSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-cyan-400/20 animate-pulse"></div>

          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 z-10"></div>

          {/* Hint mode indicator */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow-lg z-10">
            Hint Mode
          </div>

          <div
            className="relative bg-gradient-to-br from-cyan-100/20 via-blue-100/10 to-cyan-100/20 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto mt-3 border border-white/10"
            style={{
              width: dimensions.boardSize - 24,
              height: dimensions.boardSize - 24,
            }}
            onClick={resetHintCards}
          >
            {/* Layer number display */}
            {layerNumber != 0 && (
              <div className="absolute left-4 top-4 z-20">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white px-3 py-1 rounded-xl shadow-lg">
                  <span className={`font-bold ${dimensions.isMobile ? 'text-lg' : 'text-xl lg:text-2xl'}`}>
                    Layer {layerNumber + 1}
                  </span>
                </div>
              </div>
            )}

            {/* Background (dimmed) cards */}
            {topCards.map((card, index) => (
              <div
                key={`t+${index}`}
                className="absolute rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-400 shadow-xl cursor-pointer transform transition-all duration-200"
                style={{
                  top: `${(card.top + card.offset) * scaleFactor}px`,
                  left: `${(card.left + card.offset) * scaleFactor}px`,
                  width: `${(card.size.width - 1) * scaleFactor}px`,
                  height: `${(card.size.height - 1) * scaleFactor}px`,
                  zIndex: 1,
                }}
              >
                <div
                  className="absolute inset-0 bg-cover rounded-xl"
                  style={{
                    backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                    opacity: 0.4,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-xl"></div>
              </div>
            ))}

            {/* Highlighted hint cards */}
            {hintCards.map((card, index) => (
              <div
                key={`h+${index}`}
                className="absolute rounded-xl bg-gradient-to-br from-green-300 to-emerald-400 border-2 border-green-200 shadow-2xl cursor-pointer transform transition-all duration-200 animate-pulse ring-2 ring-green-400/50"
                style={{
                  top: `${(card.top + card.offset) * scaleFactor}px`,
                  left: `${(card.left + card.offset) * scaleFactor}px`,
                  width: `${(card.size.width - 1) * scaleFactor}px`,
                  height: `${(card.size.height - 1) * scaleFactor}px`,
                  zIndex: 2,
                }}
              >
                <div
                  className="absolute inset-0 bg-cover rounded-xl"
                  style={{
                    backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl"></div>
              </div>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>
    );
  }

  // -- NORMAL MODE --
  return (
    <div className="relative mx-auto flex items-center justify-center min-h-[300px]"
      style={{ width: dimensions.containerSize, height: dimensions.containerSize }}>

      {/* Enhanced Progress Border */}
      {progress > 0 && (
        <ProgressBorder
          progress={progress}
          size={dimensions.containerSize}
          strokeWidth={progressBorderSettings.strokeWidth * (dimensions.isMobile ? 0.6 : 1)}
          color={progressBorderSettings.color}
          borderRadius={progressBorderSettings.borderRadius}
          variant={progressBorderSettings.variant as 'rainbow' | 'glow' | 'pulse' | 'gradient'}
          position={progressBorderSettings.position as 'behind' | 'overlay' | 'inset'}
        />
      )}

      <div
        className="absolute bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-3xl shadow-2xl overflow-hidden border-2 border-white/20"
        style={{
          width: dimensions.boardSize,
          height: dimensions.boardSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Animated glow effect around the board */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-yellow-400/10 animate-pulse"></div>

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 z-10"></div>

        {/* Game board label */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow-lg z-10">
          Sushi Tower
        </div>

        <div
          className="relative bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-amber-100/20 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto mt-3 border border-white/10"
          style={{
            width: dimensions.boardSize - 24,
            height: dimensions.boardSize - 24,
          }}
        >
          {/* Game Start Overlay */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30">
              <div className="text-center">
                <button
                  onClick={handlePlayClick}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-3xl">▶️</span>
                    <span className="text-white font-bold text-xl">PLAY</span>
                  </div>
                </button>
                <p className="text-white/80 mt-4 text-sm">
                  Match 3 sushi pieces to clear them!
                </p>
              </div>
            </div>
          )}

          {/* Game cards */}
          {cards.map((card, index) => (
            <div
              key={`c+${index}`}
              className={`absolute ${dimensions.isMobile ? 'rounded-lg' : 'rounded-md'} ${card.state === "available"
                  ? "bg-gradient-to-br from-white/50 to-white/40 backdrop-blur-sm border border-white/50 shadow-xl cursor-pointer hover:scale-110 hover:shadow-2xl hover:border-orange-400/70 transform"
                  : "bg-gradient-to-br from-gray-400/50 to-gray-500/50 backdrop-blur-sm border border-gray-300/50 shadow-lg"
                }`}
              style={{
                top: `${(card.top + card.offset) * scaleFactor}px`,
                left: `${(card.left + card.offset) * scaleFactor}px`,
                width: `${(card.size.width - 1) * scaleFactor}px`,
                height: `${(card.size.height - 1) * scaleFactor}px`,
                zIndex: card.zIndex,
              }}
              onClick={() => card.state === "available" && handleCardClick(card)}
            >
              {/* Card background image */}
              <div
                className={`absolute inset-0 bg-cover ${dimensions.isMobile ? 'rounded-lg' : 'rounded-xl'}`}
                style={{
                  backgroundImage: `url(assets/sushi/${card.type == -1 ? "Joker" : card.type + 1}.png)`,
                  filter: card.state === "available" ? "brightness(1)" : "brightness(0.4)",
                }}
              />

              {/* Card overlay effects */}
              {card.state === "available" ? (
                <div className={`absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 ${dimensions.isMobile ? 'rounded-lg' : 'rounded-xl'}`}></div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br from-gray-400/30 to-gray-500/40 ${dimensions.isMobile ? 'rounded-lg' : 'rounded-xl'}`}></div>
              )}

              {/* Interactive card glow effect */}
              {card.state === "available" && (
                <div className={`absolute inset-0 ${dimensions.isMobile ? 'rounded-lg' : 'rounded-xl'} bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-200`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Floating progress indicator */}
      {progress > 0 && progress < 1 && gameStarted && (
        <div className={`absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold shadow-lg z-40 animate-pulse ${dimensions.isMobile ? 'text-xs' : 'text-sm'}`}>
          {Math.round(progress * 100)}%
        </div>
      )}

      {/* Progress completion celebration */}
      {progress >= 1 && gameStarted && (
        <div className={`absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold shadow-lg z-40 animate-bounce ${dimensions.isMobile ? 'text-xs' : 'text-sm'}`}>
          🎉 Complete!
        </div>
      )}
    </div>
  );
};

export default CardBoard;