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
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 400, height: 70 });

  useEffect(() =>
  {
    const updateDimensions = () =>
    {
      if (headerRef.current)
      {
        const rect = headerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (headerRef.current)
    {
      resizeObserver.observe(headerRef.current);
    }

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
      resizeObserver.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate responsive sizes based on container dimensions
  const responsiveSizes = {
    // Logo size: 40% of container height, min 24px, max 48px
    logoSize: Math.max(24, Math.min(48, containerDimensions.height * 0.4)),
    // Button size: 55% of container height as requested, min 28px, max 56px
    buttonSize: Math.max(28, Math.min(56, containerDimensions.height * 0.55)),
    // Avatar size: 40% of container height, min 20px, max 36px
    avatarSize: Math.max(20, Math.min(36, containerDimensions.height * 0.4)),
    // Font sizes based on container height
    titleFontSize: Math.max(12, Math.min(18, containerDimensions.height * 0.22)),
    subtitleFontSize: Math.max(8, Math.min(12, containerDimensions.height * 0.15)),
    usernameFontSize: Math.max(10, Math.min(16, containerDimensions.height * 0.18)),
    // Padding and gaps
    padding: Math.max(8, Math.min(24, containerDimensions.width * 0.02)),
    logoGap: Math.max(6, Math.min(16, containerDimensions.width * 0.015)),
    // Accent bar height
    accentHeight: Math.max(2, Math.min(4, containerDimensions.height * 0.06))
  };

  // Calculate dynamic gap between buttons based on available space
  const calculateButtonGap = () =>
  {
    const logoSection = responsiveSizes.logoSize + (containerDimensions.width > 300 ? 120 : 0); // Logo + title width estimate
    const userSection = responsiveSizes.avatarSize + (containerDimensions.width > 250 ? 100 : 0); // Avatar + username width estimate
    const totalButtonWidth = responsiveSizes.buttonSize * 4; // Assuming max 4 buttons
    const usedSpace = logoSection + userSection + totalButtonWidth + (responsiveSizes.padding * 4);
    const availableSpace = containerDimensions.width - usedSpace;

    // Distribute available space between buttons, min 8px, max 24px
    return Math.max(8, Math.min(24, availableSpace / 3));
  };

  const buttonGap = calculateButtonGap();

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
    <div ref={headerRef} className="relative w-full bg-gradient-to-br from-[#8B4513] via-[#704337] to-[#5D2E1F] shadow-xl h-full">
      {/* Animated top accent bar */}
      <div
        className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-pulse"
        style={{ height: `${responsiveSizes.accentHeight}px` }}
      ></div>

      {/* Main header content */}
      <div
        className="flex justify-between items-center relative h-full"
        style={{
          paddingLeft: `${responsiveSizes.padding}px`,
          paddingRight: `${responsiveSizes.padding}px`,
          paddingTop: `${responsiveSizes.padding * 0.5}px`,
          paddingBottom: `${responsiveSizes.padding * 0.5}px`
        }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>

        {/* Left side - Enhanced Logo */}
        <div
          className="flex items-center relative z-10"
          style={{ gap: `${responsiveSizes.logoGap}px` }}
        >
          <div className="relative group">
            <div
              className="rounded-full bg-gradient-to-br from-[#E0B0FF] to-[#D8A2E8] border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                width: `${responsiveSizes.logoSize}px`,
                height: `${responsiveSizes.logoSize}px`
              }}
            >
              <img
                src="assets/sushi/22.png"
                className="object-contain"
                style={{
                  width: `${responsiveSizes.logoSize * 0.6}px`,
                  height: `${responsiveSizes.logoSize * 0.6}px`
                }}
                alt="Sushi"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {!gameStarted && containerDimensions.width > 300 && (
            <div>
              <h1
                className="text-white font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent"
                style={{ fontSize: `${responsiveSizes.titleFontSize}px` }}
              >
                Sushi Master
              </h1>
              <p
                className="text-white/60"
                style={{ fontSize: `${responsiveSizes.subtitleFontSize}px` }}
              >
                Match & Collect
              </p>
            </div>
          )}
        </div>

        {/* Center - Enhanced Game Controls with Dynamic Gap */}
        <div
          className="flex items-center justify-center relative z-10 flex-1"
          style={{
            gap: `${buttonGap}px`,
            marginLeft: `${responsiveSizes.padding}px`,
            marginRight: `${responsiveSizes.padding}px`
          }}
        >
          {gameStarted && (
            <button
              onClick={handleHintSelected}
              className="group relative bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 shadow-lg"
              style={{
                width: `${responsiveSizes.buttonSize}px`,
                height: `${responsiveSizes.buttonSize}px`
              }}
              title="Get a hint"
            >
              <span style={{ fontSize: `${responsiveSizes.buttonSize * 0.5}px` }}>💡</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {gameStarted && (
            <button
              onClick={handlePlay}
              className="group relative bg-gradient-to-br from-green-400/20 to-blue-400/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-green-400/30 hover:to-blue-400/30 transition-all duration-300 shadow-lg"
              style={{
                width: `${responsiveSizes.buttonSize}px`,
                height: `${responsiveSizes.buttonSize}px`
              }}
              title="Restart the game"
            >
              <span style={{ fontSize: `${responsiveSizes.buttonSize * 0.5}px` }}>🔄</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {currentUser?.lastRound && (
            <button
              onClick={handleLoad}
              className="group relative bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm border border-purple-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-purple-400/30 hover:to-pink-400/30 transition-all duration-300 shadow-lg"
              style={{
                width: `${responsiveSizes.buttonSize}px`,
                height: `${responsiveSizes.buttonSize}px`
              }}
              title="Continue"
            >
              <span style={{ fontSize: `${responsiveSizes.buttonSize * 0.5}px` }}>⬆️</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {gameStarted && (
            <button
              onClick={handleSave}
              className="group relative bg-gradient-to-br from-pink-400/20 to-red-400/20 backdrop-blur-sm border border-pink-400/30 rounded-full flex items-center justify-center hover:scale-110 hover:from-pink-400/30 hover:to-red-400/30 transition-all duration-300 shadow-lg"
              style={{
                width: `${responsiveSizes.buttonSize}px`,
                height: `${responsiveSizes.buttonSize}px`
              }}
              title="Save progress"
            >
              <span style={{ fontSize: `${responsiveSizes.buttonSize * 0.5}px` }}>💾</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/10 to-red-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
        </div>

        {/* Right side - Enhanced User Menu */}
        <div className="relative z-10" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="group flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
            style={{
              gap: `${responsiveSizes.logoGap * 0.7}px`,
              padding: `${responsiveSizes.padding * 0.3}px ${responsiveSizes.padding * 0.6}px`
            }}
          >
            <div
              className="rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg"
              style={{
                width: `${responsiveSizes.avatarSize}px`,
                height: `${responsiveSizes.avatarSize}px`,
                fontSize: `${responsiveSizes.avatarSize * 0.4}px`
              }}
            >
              {(currentUser?.username || "P").charAt(0).toUpperCase()}
            </div>
            {containerDimensions.width > 250 && (
              <span
                className="font-medium tracking-wide max-w-24 truncate"
                style={{ fontSize: `${responsiveSizes.usernameFontSize}px` }}
              >
                {currentUser?.username || "Player"}
              </span>
            )}
            <FaCaretDown
              className={`transform transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-orange-300' : 'text-white/70'}`}
              style={{ fontSize: `${responsiveSizes.usernameFontSize * 0.8}px` }}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="py-1">
                <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.username || "Player"}</p>
                  <p className="text-xs text-gray-600">Sushi Master</p>
                </div>
                {/* <button
                  onClick={handleEdit}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 text-sm"
                >
                  <FaEdit className="text-orange-400" />
                  Change Name
                </button> */}
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
        <div
          className="bg-gradient-to-b from-[#5D2E1F] to-transparent"
          style={{ height: `${responsiveSizes.padding}px` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 opacity-50 blur-xl pointer-events-none"></div>
    </div>
  );
};

export default Header;
