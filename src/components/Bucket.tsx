import { useGameContext } from "src/context/gameContext";

const Bucket = () =>
{
  const {
    bucket,
    maxBucket,
    removeJokerPair
  } = useGameContext();

  return (
    <div className="w-full relative">
      {/* Main bucket container */}
      <div className="bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"></div>

        {/* Bucket header */}
        <div className="px-4 py-2 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Sushi Bucket</span>
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-400 to-orange-400"></div>
          </div>
        </div>

        {/* Cards container */}
        <div className="p-6 bg-gradient-to-br from-white/5 via-transparent to-white/5">
          <div className="grid lg:grid-cols-5 grid-cols-8 gap-3 justify-center">
            {/* Filled slots */}
            {bucket.map((card, index) => (
              <div
                key={`b+${index}`}
                className={`
                  relative group w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden
                  transform transition-all duration-300 hover:scale-105
                  ${card.highlight
                    ? 'cursor-pointer ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent shadow-lg shadow-yellow-400/50 animate-pulse'
                    : 'shadow-md hover:shadow-lg'
                  }
                `}
                style={{
                  backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => { card.highlight && removeJokerPair(card.type) }}
              >
                {/* Card background with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 rounded-xl"></div>

                {/* Highlight overlay for interactive cards */}
                {card.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl animate-pulse"></div>
                )}

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 rounded-xl transition-all duration-300"></div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: maxBucket - bucket.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/20 flex items-center justify-center group hover:border-white/40 transition-all duration-300"
              >
                {/* Empty slot indicator */}
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-white/20 to-white/10 group-hover:from-white/30 group-hover:to-white/20 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section with capacity indicator */}
        <div className="px-4 py-2 bg-gradient-to-r from-white/5 to-transparent border-t border-white/10">
          <div className="flex items-center justify-center gap-3">
            <span className="text-white/60 text-xs font-medium">{bucket.length}</span>

            {/* Capacity bar */}
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-32">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(bucket.length / maxBucket) * 100}%` }}
              ></div>
            </div>

            <span className="text-white/60 text-xs font-medium">{maxBucket}</span>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-50 blur-xl -z-10"></div>
    </div>
  );
};

export default Bucket;