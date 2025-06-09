import { useState, useEffect, useRef } from 'react';
import { FaCaretDown, FaUser, FaCog, FaEdit, FaGamepad } from "react-icons/fa";
import { useGameContext } from "src/context/gameContext";

const Header = () =>
{
  const {
    currentUser,
    gameStarted,
    setGameStarted,
    restartGame,
    handleHintSelected,
    handleLoad,
    handleSave,
    setShowEditModal,
    setShowSettingsModal
  } = useGameContext();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() =>
  {
    const checkMobile = () =>
    {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleClickOutside = (event: MouseEvent) =>
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
      {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
    {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () =>
  {
    setDropdownOpen(prev => !prev);
  };

  const handleEdit = () =>
  {
    setShowEditModal(true);
    setDropdownOpen(false);
  };

  const handleSettings = () =>
  {
    setShowSettingsModal(true);
    setDropdownOpen(false);
  };

  const handlePlay = () =>
  {
    setGameStarted(true);
    restartGame();
  };

  // Compact header for all screen sizes
  return (
    <div className="relative w-full bg-gradient-to-r from-[#8B4513] via-[#704337] to-[#5D2E1F] shadow-lg border-b-4 border-[#4A2C1A] rounded-lg">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-t-lg"></div>

      <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3">
        {/* Left side - Compact Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#E0B0FF] to-[#D8A2E8] border-2 border-white shadow-lg flex items-center justify-center">
              <img
                src="assets/sushi/22.png"
                className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                alt="Sushi"
              />
            </div>
          </div>
        </div>

        {/* Center - Game Controls (Icons Only) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {gameStarted && (
            <button
              onClick={handleHintSelected}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E0B0FF]/80 to-[#D8A2E8]/80 border border-white/20 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
              title="Get a hint"
            >
              <span className="text-sm sm:text-base">💡</span>
            </button>
          )}

          {gameStarted && (
            <button
              onClick={handlePlay}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#8B4513]/90 via-[#704337]/90 to-[#5D2E1F]/90 border border-white/20 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg hover:from-orange-400 hover:to-yellow-400"
              title="Restart the game"
            >
              <span className="text-sm sm:text-base">🔄</span>
            </button>
          )}

          {currentUser?.lastRound && (
            <button
              onClick={handleLoad}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100/80 to-pink-100/80 border border-orange-300/40 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
              title="Continue"
            >
              <span className="text-sm sm:text-base">⬆️</span>
            </button>
          )}

          {gameStarted && (
            <button
              onClick={handleSave}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-200/80 to-pink-200/80 border border-pink-300/40 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
              title="Save progress"
            >
              <span className="text-sm sm:text-base">💾</span>
            </button>
          )}
        </div>

        {/* Right side - User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              {(currentUser?.username || "P").charAt(0).toUpperCase()}
            </div>
            {!isMobile && (
              <span className="font-medium tracking-wide text-xs sm:text-sm max-w-20 truncate">
                {currentUser?.username || "Player"}
              </span>
            )}
            <FaCaretDown className={`text-xs transform transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-orange-300' : 'text-white/70'}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="py-1">
                <div className="px-4 py-2 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.username || "Player"}</p>
                  <p className="text-xs text-gray-600">Sushi Master</p>
                </div>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 text-sm"
                >
                  <FaEdit className="text-orange-400" />
                  Change Name
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 text-sm"
                >
                  <FaCog className="text-pink-400" />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default Header;