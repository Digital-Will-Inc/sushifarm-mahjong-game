import { useGameContext } from "src/context/gameContext";

const Bucket = () =>
{
  const {
    bucket,
    maxBucket,
    removeJokerPair
  } = useGameContext();

  const calculateGridCols = () =>
  {
    const totalSlots = Math.max(maxBucket, 8);
    if (totalSlots <= 6) return 6;
    if (totalSlots <= 8) return 8;
    if (totalSlots <= 10) return 10;
    return 12;
  };

  const gridCols = calculateGridCols();

  return (
    <div className="w-full h-full relative">
      {/* Seamlessly connected bucket container */}
      <div className="bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-b-2xl shadow-xl border-l border-r border-b border-white/10 overflow-hidden h-full flex flex-col">

        {/* Bucket header - more compact */}
        <div className="px-4 py-2 relative">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse"></div>
            <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">Sushi Collection</span>
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 animate-pulse"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-px"></div>
        </div>

        {/* Cards container - optimized for compact height */}
        <div className="flex-1 px-4 py-3 min-h-0 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white/5_1px,_transparent_1px)] bg-[length:20px_20px] opacity-30"></div>

          <div
            className="grid gap-2 justify-center h-full content-center relative z-10"
            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
          >
            {/* Filled slots */}
            {bucket.map((card, index) => (
              <div
                key={`bucket-${index}`}
                className={`
                  relative group w-full aspect-square rounded-xl overflow-hidden
                  transform transition-all duration-300 hover:scale-110 hover:rotate-1 max-w-10 max-h-10
                  ${card.highlight
                    ? 'cursor-pointer ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse z-20'
                    : 'shadow-lg hover:shadow-xl hover:shadow-purple-500/20'
                  }
                `}
                style={{
                  backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => { card.highlight && removeJokerPair(card.type) }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 rounded-xl"></div>
                {card.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded-xl animate-pulse"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-purple-400/20 rounded-xl transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: maxBucket - bucket.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-full aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/30 flex items-center justify-center group hover:border-white/50 hover:bg-white/15 transition-all duration-300 max-w-10 max-h-10"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-white/30 to-white/10 group-hover:from-white/50 group-hover:to-white/20 group-hover:scale-125 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact capacity indicator */}
        <div className="px-4 py-2 relative">
          <div className="flex items-center justify-center gap-3">
            <span className="text-white/80 text-xs font-medium">{bucket.length}</span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden max-w-24 relative">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${(bucket.length / maxBucket) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
              </div>
            </div>
            <span className="text-white/80 text-xs font-medium">{maxBucket}</span>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-50 rounded-b-2xl"></div>
      </div>
    </div>
  );
};

export default Bucket;
