import { useGameContext } from "src/context/gameContext";

const GameInfo = () =>
{
  const {
    currentRound,
    lives,
    score,
  } = useGameContext();

  return (
    <div className="w-full relative">
      {/* Main container with gradient and modern styling */}
      <div className="bg-gradient-to-r from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-xl shadow-lg border border-white/10 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>

        {/* Content area */}
        <div className="px-6 py-4 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex justify-between items-center gap-6">
            {/* Score section */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-sm"></div>
              <div className="flex flex-col">
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Score</span>
                <span className="text-white text-xl font-bold tracking-wide drop-shadow-sm">
                  {score.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Lives section */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Lives</span>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: Math.max(lives, 0) }, (_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-br from-red-400 to-pink-500 shadow-sm animate-pulse"></div>
                  ))}
                  {Array.from({ length: Math.max(5 - lives, 0) }, (_, i) => (
                    <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-white/20 border border-white/30"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage section */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Stage</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-bold tracking-wide drop-shadow-sm">
                    {currentRound.roundNumber}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#8B4513] via-[#704337] to-[#5D2E1F] opacity-20 blur-lg -z-10"></div>
    </div>
  )
}

export default GameInfo;