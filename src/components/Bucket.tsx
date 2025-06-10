import { useEffect, useRef, useState } from "react";
import { useGameContext } from "src/context/gameContext";

const Bucket = () =>
{
  const {
    bucket,
    maxBucket,
    removeJokerPair
  } = useGameContext();

  const bucketRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 400, height: 100 });

  useEffect(() =>
  {
    const updateDimensions = () =>
    {
      if (bucketRef.current)
      {
        const rect = bucketRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (bucketRef.current)
    {
      resizeObserver.observe(bucketRef.current);
    }

    return () =>
    {
      resizeObserver.disconnect();
    };
  }, []);

  const calculateGridCols = () =>
  {
    const totalSlots = Math.max(maxBucket, 8);
    const availableWidth = containerDimensions.width - 32; // Account for padding
    const minCardSize = 20;
    const maxCols = Math.floor(availableWidth / (minCardSize + 8)); // 8px gap

    if (totalSlots <= 6) return Math.min(6, maxCols);
    if (totalSlots <= 8) return Math.min(8, maxCols);
    if (totalSlots <= 10) return Math.min(10, maxCols);
    return Math.min(12, maxCols);
  };

  const gridCols = calculateGridCols();

  // Calculate responsive sizes based on container dimensions
  const responsiveSizes = {
    // Header height: 20-25% of container height, min 20px, max 40px
    headerHeight: Math.max(20, Math.min(40, containerDimensions.height * 0.22)),
    // Footer height: 15-20% of container height, min 16px, max 32px
    footerHeight: Math.max(16, Math.min(32, containerDimensions.height * 0.18)),
    // Card area takes remaining space
    cardAreaHeight: containerDimensions.height - Math.max(20, Math.min(40, containerDimensions.height * 0.22)) - Math.max(16, Math.min(32, containerDimensions.height * 0.18)),
    // Card size based on available space and grid
    cardSize: Math.max(16, Math.min(48, Math.min(
      (containerDimensions.width - 32) / gridCols - 8, // Width constraint
      (containerDimensions.height * 0.6) / Math.ceil(maxBucket / gridCols) - 8 // Height constraint
    ))),
    // Font sizes
    titleFontSize: Math.max(10, Math.min(14, containerDimensions.height * 0.14)),
    capacityFontSize: Math.max(8, Math.min(12, containerDimensions.height * 0.12)),
    // Padding and gaps
    padding: Math.max(8, Math.min(16, containerDimensions.width * 0.02)),
    gap: Math.max(4, Math.min(8, containerDimensions.width * 0.01)),
    // Progress bar
    progressBarHeight: Math.max(4, Math.min(8, containerDimensions.height * 0.08)),
    progressBarWidth: Math.max(60, Math.min(120, containerDimensions.width * 0.3))
  };

  return (
    <div ref={bucketRef} className="w-full h-full relative">
      {/* Seamlessly connected bucket container */}
      <div className="bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-b-2xl shadow-xl border-l border-r border-b border-white/10 overflow-hidden h-full flex flex-col">

        {/* Bucket header - responsive height */}
        <div
          className="relative flex-shrink-0"
          style={{
            height: `${responsiveSizes.headerHeight}px`,
            padding: `${responsiveSizes.padding * 0.5}px ${responsiveSizes.padding}px`
          }}
        >
          <div className="flex items-center justify-center h-full" style={{ gap: `${responsiveSizes.gap}px` }}>
            <div
              className="rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse"
              style={{
                width: `${responsiveSizes.titleFontSize * 0.5}px`,
                height: `${responsiveSizes.titleFontSize * 0.5}px`
              }}
            ></div>
            <span
              className="text-white/90 font-semibold uppercase tracking-wider"
              style={{ fontSize: `${responsiveSizes.titleFontSize}px` }}
            >
              Sushi Collection
            </span>
            <div
              className="rounded-full bg-gradient-to-br from-pink-400 to-orange-400 animate-pulse"
              style={{
                width: `${responsiveSizes.titleFontSize * 0.5}px`,
                height: `${responsiveSizes.titleFontSize * 0.5}px`
              }}
            ></div>
          </div>
        </div>

        {/* Cards container - flexible height with centered grid */}
        <div
          className="flex-1 relative min-h-0 flex items-center justify-center"
          style={{
            padding: `${responsiveSizes.padding * 0.75}px ${responsiveSizes.padding}px`
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white/5_1px,_transparent_1px)] bg-[length:20px_20px] opacity-30"></div>

          {/* Centered grid container */}
          <div
            className="grid relative z-10"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: `${responsiveSizes.gap}px`,
              justifyItems: 'center',
              alignItems: 'center'
            }}
          >
            {/* Filled slots */}
            {bucket.map((card, index) => (
              <div
                key={`bucket-${index}`}
                className={`
                  relative group aspect-square rounded-xl overflow-hidden
                  transform transition-all duration-300 hover:scale-110 hover:rotate-1
                  ${card.highlight
                    ? 'cursor-pointer ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse z-20'
                    : 'shadow-lg hover:shadow-xl hover:shadow-purple-500/20'
                  }
                `}
                style={{
                  width: `${responsiveSizes.cardSize}px`,
                  height: `${responsiveSizes.cardSize}px`,
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
                className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/30 flex items-center justify-center group hover:border-white/50 hover:bg-white/15 transition-all duration-300"
                style={{
                  width: `${responsiveSizes.cardSize}px`,
                  height: `${responsiveSizes.cardSize}px`
                }}
              >
                <div
                  className="rounded-full bg-gradient-to-br from-white/30 to-white/10 group-hover:from-white/50 group-hover:to-white/20 group-hover:scale-125 transition-all duration-300"
                  style={{
                    width: `${responsiveSizes.cardSize * 0.15}px`,
                    height: `${responsiveSizes.cardSize * 0.15}px`
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact capacity indicator */}
        <div
          className="relative flex-shrink-0"
          style={{
            height: `${responsiveSizes.footerHeight}px`,
            padding: `${responsiveSizes.padding * 0.5}px ${responsiveSizes.padding}px`
          }}
        >
          <div className="flex items-center justify-center h-full" style={{ gap: `${responsiveSizes.gap}px` }}>
            <span
              className="text-white/80 font-medium"
              style={{ fontSize: `${responsiveSizes.capacityFontSize}px` }}
            >
              {bucket.length}
            </span>
            <div
              className="bg-white/20 rounded-full overflow-hidden relative"
              style={{
                height: `${responsiveSizes.progressBarHeight}px`,
                width: `${responsiveSizes.progressBarWidth}px`
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${(bucket.length / maxBucket) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
              </div>
            </div>
            <span
              className="text-white/80 font-medium"
              style={{ fontSize: `${responsiveSizes.capacityFontSize}px` }}
            >
              {maxBucket}
            </span>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div
          className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-50 rounded-b-2xl"
          style={{ height: `${Math.max(2, responsiveSizes.footerHeight * 0.1)}px` }}
        ></div>
      </div>
    </div>
  );
};

export default Bucket;
