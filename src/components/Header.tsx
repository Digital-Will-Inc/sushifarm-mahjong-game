import { useState, useEffect, useRef } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { useGameContext } from "src/context/gameContext";

const Header = () =>
{
  const {
    currentUser,
    gameStarted,
    setShowEditModal,
    setShowSettingsModal,
    handleSave,
    handleLoad
  } = useGameContext();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() =>
  {
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
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

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
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-[#8B4513] via-[#704337] to-[#5D2E1F] shadow-lg border-b-4 border-[#4A2C1A]">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>

      <div className="flex justify-between items-center px-6 py-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Sushi container with better styling */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E0B0FF] to-[#D8A2E8] border-4 border-white shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <img
                src="assets/sushi/22.png"
                className="w-8 h-8 object-contain drop-shadow-sm"
                alt="Sushi"
              />
            </div>
            {/* Decorative glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E0B0FF] to-[#D8A2E8] opacity-30 blur-md -z-10"></div>
          </div>
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {/* User avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {(currentUser?.username || "P").charAt(0).toUpperCase()}
              </div>
              <span className="font-medium tracking-wide">{currentUser?.username || "Player"}</span>
              <FaCaretDown className={`transform transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-orange-300' : 'text-white/70'}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    Change Name
                  </button>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2"></div>
                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 flex items-center gap-3 font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default Header;