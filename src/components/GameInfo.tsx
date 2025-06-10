import { useEffect, useRef, useState } from "react";
import { useGameContext } from "src/context/gameContext";

const GameInfo = () =>
{
  const {
    currentRound,
    score,
    lives,
    stackedScore,
    currentUser
  } = useGameContext();

  const gameInfoRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 400, height: 80 });

  useEffect(() =>
  {
    const updateDimensions = () =>
    {
      if (gameInfoRef.current)
      {
        const rect = gameInfoRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (gameInfoRef.current)
    {
      resizeObserver.observe(gameInfoRef.current);
    }

    return () =>
    {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate responsive sizes based on container dimensions
  const responsiveSizes = {
    // Heart size: 6-8% of container height, min 16px, max 32px
    heartSize: Math.max(16, Math.min(32, containerDimensions.height * 0.35)),
    // Font sizes based on container height
    labelFontSize: Math.max(8, Math.min(12, containerDimensions.height * 0.15)),
    valueFontSize: Math.max(12, Math.min(20, containerDimensions.height * 0.25)),
    // Padding and gaps
    padding: Math.max(8, Math.min(16, containerDimensions.width * 0.02)),
    sectionGap: Math.max(8, Math.min(20, containerDimensions.width * 0.02)),
    heartGap: Math.max(2, Math.min(6, containerDimensions.width * 0.005)),
    // Accent bar height
    accentHeight: Math.max(2, Math.min(4, containerDimensions.height * 0.05)),
    // Divider dimensions
    dividerHeight: Math.max(16, Math.min(32, containerDimensions.height * 0.4)),
    dividerWidth: Math.max(1, Math.min(2, containerDimensions.width * 0.002))
  };

  return (
    <div ref={gameInfoRef} className="w-full h-full relative">
      {/* Unified HUD Container */}
      <div className="bg-gradient-to-r from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-lg shadow-lg border border-white/10 overflow-hidden h-full">
        {/* Top accent bar */}
        <div
          className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"
          style={{ height: `${responsiveSizes.accentHeight}px` }}
        ></div>

        {/* Content */}
        <div
          className="h-full flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent"
          style={{
            paddingLeft: `${responsiveSizes.padding}px`,
            paddingRight: `${responsiveSizes.padding}px`,
            paddingTop: `${responsiveSizes.padding * 0.5}px`,
            paddingBottom: `${responsiveSizes.padding * 0.5}px`
          }}
        >

          {/* Left side - Score & Round */}
          <div
            className="flex items-center"
            style={{ gap: `${responsiveSizes.sectionGap}px` }}
          >
            <div className="text-center">
              <div
                className="text-white/60 uppercase tracking-wide"
                style={{ fontSize: `${responsiveSizes.labelFontSize}px` }}
              >
                Score
              </div>
              <div
                className="text-white font-bold"
                style={{ fontSize: `${responsiveSizes.valueFontSize}px` }}
              >
                {score.toLocaleString()}
              </div>
            </div>

            <div
              className="bg-white/20"
              style={{
                width: `${responsiveSizes.dividerWidth}px`,
                height: `${responsiveSizes.dividerHeight}px`
              }}
            ></div>

            <div className="text-center">
              <div
                className="text-white/60 uppercase tracking-wide"
                style={{ fontSize: `${responsiveSizes.labelFontSize}px` }}
              >
                Round
              </div>
              <div
                className="text-white font-bold"
                style={{ fontSize: `${responsiveSizes.valueFontSize}px` }}
              >
                {currentRound?.roundNumber || 1}
              </div>
            </div>
          </div>

          {/* Center container with flex-1 for spacing */}
          <div className="flex-1 flex justify-center">
            {/* Center - Lives */}
            <div
              className="flex items-center"
              style={{ gap: `${responsiveSizes.heartGap}px` }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full flex items-center justify-center ${index < lives
                      ? 'bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-lg'
                      : 'bg-white/20 text-white/40'
                    }`}
                  style={{
                    width: `${responsiveSizes.heartSize}px`,
                    height: `${responsiveSizes.heartSize}px`,
                    fontSize: `${responsiveSizes.heartSize * 0.6}px`
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Stacked Score */}
          <div className="text-center">
            <div
              className={`${stackedScore > 0 ? 'text-yellow-400/80' : 'text-white'} uppercase tracking-wide`}
              style={{ fontSize: `${responsiveSizes.labelFontSize}px` }}
            >
              {stackedScore > 0 ? `Bonus` : 'No Bonus'}
            </div>
            <div
              className={`${stackedScore > 0 ? 'text-yellow-400' : 'text-white'} font-bold`}
              style={{ fontSize: `${responsiveSizes.valueFontSize}px` }}
            >
              {stackedScore > 0 ? `+${stackedScore.toLocaleString()}` : ''}
            </div>
          </div>

        </div>

        {/* Bottom decorative line */}
        <div
          className="bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ height: `${Math.max(1, responsiveSizes.accentHeight * 0.5)}px` }}
        ></div>
      </div>
    </div>
  );
};

export default GameInfo;
