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

  return (
    <div className="w-full h-full relative">
      {/* Unified HUD Container */}
      <div className="bg-gradient-to-r from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-lg shadow-lg border border-white/10 overflow-hidden h-full">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"></div>

        {/* Content */}
        <div className="px-4 py-2 h-full flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">

          {/* Left side - Score & Round */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-white/60 text-xs uppercase tracking-wide">Score</div>
              <div className="text-white font-bold text-lg">{score.toLocaleString()}</div>
            </div>

            <div className="w-px h-8 bg-white/20"></div>

            <div className="text-center">
              <div className="text-white/60 text-xs uppercase tracking-wide">Round</div>
              <div className="text-white font-bold text-lg">{currentRound?.roundNumber || 1}</div>
            </div>
          </div>

          {/* Center container with flex-1 for spacing */}
          <div className="flex-1 flex justify-center">
            {/* Center - Lives */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${index < lives
                    ? 'bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-lg'
                    : 'bg-white/20 text-white/40'
                    }`}
                >
                  ❤️
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Stacked Score */}
          <div className="text-center">
            <div className={`${stackedScore > 0 ? 'text-yellow-400/80' : 'text-white'} text-xs uppercase tracking-wide`}>
              {stackedScore > 0 ? `Bonus` : 'No Bonus'}
            </div>
            <div className={`${stackedScore > 0 ? 'text-yellow-400' : 'text-white'} font-bold text-lg`}>
              {stackedScore > 0 ? `+${stackedScore.toLocaleString()}` : ''}
            </div>
          </div>

        </div>

        {/* Bottom decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default GameInfo;
