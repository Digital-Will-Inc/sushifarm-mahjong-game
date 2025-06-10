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

  return (
    <div className="relative w-full bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] shadow-xl">
      {/* Animated top accent bar */}
      <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-pulse"></div>

      {/* Main header content */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>

        {/* Left side - Enhanced Logo */}
        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="relative group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E0B0FF] to-[#D8A2E8] border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img
                src="assets/sushi/22.png"
                className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                alt="Sushi"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {!gameStarted && (
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Sushi Master
              </h1>
              <p className="text-white/60 text-xs">Match & Collect</p>
            </div>
          )}
        </div>

        {/* Center - Enhanced Game Controls */}
        <div className="flex items-center gap-2 sm:gap-3 relative z-10">
          {gameStarted && (
            <button
              onClick={handleHintSelected}
              className="group relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 shadow-lg"
              title="Get a hint"
            >
              <span className="text-lg sm:text-xl">💡</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {gameStarted && (
            <button
              onClick={handlePlay}
              className="group relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-green-400/30 hover:to-blue-400/30 transition-all duration-300 shadow-lg"
              title="Restart the game"
            >
              <span className="text-lg sm:text-xl">🔄</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {currentUser?.lastRound && (
            <button
              onClick={handleLoad}
              className="group relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm border border-purple-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-purple-400/30 hover:to-pink-400/30 transition-all duration-300 shadow-lg"
              title="Continue"
            >
              <span className="text-lg sm:text-xl">⬆️</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {gameStarted && (
            <button
              onClick={handleSave}
              className="group relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400/20 to-red-400/20 backdrop-blur-sm border border-pink-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-pink-400/30 hover:to-red-400/30 transition-all duration-300 shadow-lg"
              title="Save progress"
            >
              <span className="text-lg sm:text-xl">💾</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/10 to-red-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
        </div>

        {/* Right side - Enhanced User Menu */}
        <div className="relative z-10" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
              {(currentUser?.username || "P").charAt(0).toUpperCase()}
            </div>
            {!isMobile && (
              <span className="font-medium tracking-wide text-sm sm:text-base max-w-24 truncate">
                {currentUser?.username || "Player"}
              </span>
            )}
            <FaCaretDown className={`text-sm transform transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-orange-300' : 'text-white/70'}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="py-1">
                <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.username || "Player"}</p>
                  <p className="text-xs text-gray-600">Sushi Master</p>
                </div>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 text-sm"
                >
                  <FaEdit className="text-orange-400" />
                  Change Name
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 text-sm"
                >
                  <FaCog className="text-pink-400" />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seamless transition element - connects to bucket */}
      <div className="relative">
        <div className="h-4 bg-gradient-to-b from-[#5D2E1F] to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 opacity-50 blur-xl pointer-events-none"></div>
    </div>
  );
};

export default Header;