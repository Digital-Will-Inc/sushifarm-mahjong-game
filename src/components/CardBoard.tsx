import { useGameContext } from "src/context/gameContext";

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
  } = useGameContext();

  if (isHint) return (
    <div
      className="bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-3xl shadow-2xl overflow-hidden mx-auto border-2 border-white/20 relative"
      style={{
        width: cardBoardWidth,
        height: cardBoardWidth,
      }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 z-10"></div>

      {/* Hint mode indicator */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow-lg z-10">
        Hint Mode
      </div>

      <div
        className="relative bg-gradient-to-br from-cyan-100/20 via-blue-100/10 to-cyan-100/20 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto mt-3 border border-white/10"
        style={{
          width: cardBoardWidth - 24,
          height: cardBoardWidth - 24,
        }}
        onClick={resetHintCards}
      >
        {/* Layer number display */}
        {layerNumber != 0 && (
          <div className="absolute left-4 top-4 z-20">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white px-3 py-1 rounded-xl shadow-lg">
              <span className="text-lg lg:text-2xl font-bold">Layer {layerNumber + 1}</span>
            </div>
          </div>
        )}

        {/* Background (dimmed) cards */}
        {topCards.map((card, index) => (
          <div
            key={`t+${index}`}
            className="absolute rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-400 shadow-xl cursor-pointer transform transition-all duration-200"
            style={{
              top: `${card.top + card.offset}px`,
              left: `${card.left + card.offset}px`,
              width: `${card.size.width - 1}px`,
              height: `${card.size.height - 1}px`,
              zIndex: 1,
            }}
          >
            <div
              className="absolute inset-0 bg-cover rounded-xl"
              style={{
                backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                opacity: 0.4
              }}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-xl"></div>
          </div>
        ))}

        {/* Highlighted hint cards */}
        {hintCards.map((card, index) => (
          <div
            key={`h+${index}`}
            className="absolute rounded-xl bg-gradient-to-br from-green-300 to-emerald-400 border-2 border-green-200 shadow-2xl cursor-pointer transform transition-all duration-200 animate-pulse ring-2 ring-green-400/50"
            style={{
              top: `${card.top + card.offset}px`,
              left: `${card.left + card.offset}px`,
              width: `${card.size.width - 1}px`,
              height: `${card.size.height - 1}px`,
              zIndex: 2,
            }}
          >
            {/* Card content */}
            <div
              className="absolute inset-0 bg-cover rounded-xl"
              style={{
                backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
              }}
            />
            {/* Highlight glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl"></div>
          </div>
        ))}
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  )

  return (
    <div
      className="bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] rounded-3xl shadow-2xl overflow-hidden mx-auto border-2 border-white/20 relative"
      style={{
        width: cardBoardWidth,
        height: cardBoardWidth,
      }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 z-10"></div>

      {/* Game board label */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow-lg z-10">
        Sushi Tower
      </div>

      <div
        className="relative bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-amber-100/20 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto mt-3 border border-white/10"
        style={{
          width: cardBoardWidth - 24,
          height: cardBoardWidth - 24,
        }}
      >
        {/* Game cards */}
        {cards.map((card, index) => (
          <div
            key={`c+${index}`}
            className={`absolute rounded-md ${card.state === "available"
              ? "bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-sm border border-white/30 shadow-xl cursor-pointer hover:scale-110 hover:shadow-2xl hover:border-orange-400/50 transform"

              : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-600/30 shadow-lg"
              }`}
            style={{
              top: `${card.top + card.offset}px`,
              left: `${card.left + card.offset}px`,
              width: `${card.size.width - 1}px`,
              height: `${card.size.height - 1}px`,
              zIndex: card.zIndex,
            }}
            onClick={() => card.state === "available" && handleCardClick(card)}
          >
            {/* Card background image */}
            <div
              className="absolute inset-0 bg-cover rounded-xl"
              style={{
                backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                filter: card.state === "available" ? "brightness(1)" : "brightness(0.4)",
              }}
            />

            {/* Card overlay effects */}
            {card.state === "available" ? (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl"></div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60 rounded-xl"></div>
            )}

            {/* Interactive card glow effect */}
            {card.state === "available" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 hover:from-yellow-400/20 hover:to-orange-400/20 transition-all duration-200"></div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default CardBoard;