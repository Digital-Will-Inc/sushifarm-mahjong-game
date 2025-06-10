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
    restartGame,
    cardSize
  } = useGameContext();

  const [initialCardCount, setInitialCardCount] = useState(0);
  const gameStateRef = useRef({ roundNumber: -1, gameStarted: false });

  // Optimized card sizing - use more of the available board space
  const boardPadding = 20;
  const effectiveBoardSize = cardBoardWidth - (boardPadding * 2);

  // Calculate optimal card size based on board utilization
  const optimalCardSize = Math.max(
    Math.floor(effectiveBoardSize / 11), // 11 instead of 12 for better spacing
    cardSize
  );

  // Scale factor for responsive positioning
  const scaleFactor = effectiveBoardSize / (cardBoardWidth - 40);

  // Dynamic button sizes based on board size
  const buttonPadding = Math.max(effectiveBoardSize * 0.015, 6);
  const buttonRadius = Math.max(effectiveBoardSize * 0.03, 8);
  const playIconSize = Math.max(effectiveBoardSize * 0.06, 20);
  const playTextSize = Math.max(effectiveBoardSize * 0.04, 14);

  // Dynamic title styles based on board size
  const titlePadding = Math.max(effectiveBoardSize * 0.01, 3);
  const titleFontSize = Math.max(effectiveBoardSize * 0.025, 10);
  const titleTopOffset = Math.max(effectiveBoardSize * 0.015, 8);

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

  const progress = initialCardCount > 0 ? Math.max(0, 1 - (cards.length / initialCardCount)) : 0;

  const handlePlayClick = () =>
  {
    setGameStarted(true);
    restartGame();
  };

  // Common board container styles
  const boardContainerStyle = {
    width: cardBoardWidth,
    height: cardBoardWidth,
  };

  const boardStyle = {
    width: effectiveBoardSize,
    height: effectiveBoardSize,
  };

  if (isHint)
  {
    return (
      <div className="relative flex items-center justify-center" style={boardContainerStyle}>
        {progress > 0 && (
          <ProgressBorder
            progress={progress}
            size={cardBoardWidth}
            strokeWidth={16}
            color="#00CFFF"
            borderRadius={36}
            variant="pulse"
            position="behind"
          />
        )}

        <div
          className="absolute bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-3xl shadow-2xl overflow-hidden border-2 border-white/20"
          style={{
            ...boardStyle,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-cyan-400/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 z-10"></div>

          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow-lg z-10">
            Hint Mode
          </div>

          <div
            className="relative bg-gradient-to-br from-cyan-100/20 via-blue-100/10 to-cyan-100/20 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto mt-3 border border-white/10"
            style={{
              width: effectiveBoardSize - 24,
              height: effectiveBoardSize - 24,
            }}
            onClick={resetHintCards}
          >
            {layerNumber != 0 && (
              <div className="absolute left-4 top-4 z-20">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white px-3 py-1 rounded-xl shadow-lg">
                  <span className="font-bold text-lg">Layer {layerNumber + 1}</span>
                </div>
              </div>
            )}

            {/* Background cards */}
            {topCards.map((card, index) => (
              <div
                key={`t+${index}`}
                className="absolute rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-400 shadow-xl cursor-pointer transform transition-all duration-200"
                style={{
                  top: `${(card.top + card.offset) * scaleFactor}px`,
                  left: `${(card.left + card.offset) * scaleFactor}px`,
                  width: `${optimalCardSize}px`,
                  height: `${optimalCardSize}px`,
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

            {/* Hint cards */}
            {hintCards.map((card, index) => (
              <div
                key={`h+${index}`}
                className="absolute rounded-xl bg-gradient-to-br from-green-300 to-emerald-400 border-2 border-green-200 shadow-2xl cursor-pointer transform transition-all duration-200 animate-pulse ring-2 ring-green-400/50"
                style={{
                  top: `${(card.top + card.offset) * scaleFactor}px`,
                  left: `${(card.left + card.offset) * scaleFactor}px`,
                  width: `${optimalCardSize}px`,
                  height: `${optimalCardSize}px`,
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

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={boardContainerStyle}>
      {progress > 0 && (
        <ProgressBorder
          progress={progress}
          size={cardBoardWidth}
          strokeWidth={progressBorderSettings.strokeWidth}
          color={progressBorderSettings.color}
          borderRadius={progressBorderSettings.borderRadius}
          variant={progressBorderSettings.variant as 'rainbow' | 'glow' | 'pulse' | 'gradient'}
          position={progressBorderSettings.position as 'behind' | 'overlay' | 'inset'}
        />
      )}

      <div
        className="absolute bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-3xl shadow-2xl overflow-hidden border-2 border-white/20"
        style={{
          ...boardStyle,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-yellow-400/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 z-10"></div>

        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-white font-medium shadow-lg z-10 whitespace-nowrap"
          style={{
            top: `${titleTopOffset}px`,
            padding: `${titlePadding * 0.5}px ${titlePadding * 1.2}px`,
            fontSize: `${titleFontSize}px`,
            lineHeight: '1',
          }}
        >
          Sushi Tower
        </div>

        <div
          className="relative bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-amber-100/20 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto mt-3 border border-white/10"
          style={{
            width: effectiveBoardSize - 24,
            height: effectiveBoardSize - 24,
          }}
        >
          {!gameStarted && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30">
              <div className="text-center">
                <button
                  onClick={handlePlayClick}
                  className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
                  style={{
                    padding: `${buttonPadding}px ${buttonPadding * 2}px`,
                    borderRadius: `${buttonRadius}px`,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ borderRadius: `${buttonRadius}px` }}
                  ></div>
                  <div className="relative flex items-center gap-3">
                    <span style={{ fontSize: `${playIconSize}px` }}>▶️</span>
                    <span
                      className="text-white font-bold"
                      style={{ fontSize: `${playIconSize * 0.7}px` }}
                    >
                      PLAY
                    </span>
                  </div>
                </button>
                <p
                  className="text-white/80 mt-4"
                  style={{ fontSize: `${playIconSize * 0.45}px` }}
                >
                  Match 3 sushi pieces to clear them!
                </p>
              </div>
            </div>
          )}

          {/* Optimized game cards with better sizing */}
          {cards.map((card, index) => (
            <div
              key={`c+${index}`}
              className={`absolute rounded-xl ${card.state === "available"
                ? "bg-gradient-to-br from-white/50 to-white/40 backdrop-blur-sm border border-white/50 shadow-xl cursor-pointer hover:scale-110 hover:shadow-2xl hover:border-orange-400/70 transform"
                : "bg-gradient-to-br from-gray-400/50 to-gray-500/50 backdrop-blur-sm border border-gray-300/50 shadow-lg"
                }`}
              style={{
                top: `${(card.top + card.offset) * scaleFactor}px`,
                left: `${(card.left + card.offset) * scaleFactor}px`,
                width: `${optimalCardSize}px`,
                height: `${optimalCardSize}px`,
                zIndex: card.zIndex,
              }}
              onClick={() => card.state === "available" && handleCardClick(card)}
            >
              <div
                className="absolute inset-0 bg-cover rounded-xl"
                style={{
                  backgroundImage: `url(assets/sushi/${card.type == -1 ? "Joker" : card.type + 1}.png)`,
                  filter: card.state === "available" ? "brightness(1)" : "brightness(0.4)",
                }}
              />

              {card.state === "available" ? (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-xl"></div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-gray-500/40 rounded-xl"></div>
              )}

              {card.state === "available" && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-200"></div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Progress indicators */}
      {progress > 0 && progress < 1 && gameStarted && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold shadow-lg z-40 animate-pulse text-sm">
          {Math.round(progress * 100)}%
        </div>
      )}

      {progress >= 1 && gameStarted && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold shadow-lg z-40 animate-bounce text-sm">
          🎉 Complete!
        </div>
      )}
    </div>
  );
};

export default CardBoard;
