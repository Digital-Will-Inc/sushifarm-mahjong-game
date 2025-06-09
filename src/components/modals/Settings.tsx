import { FaTimes } from 'react-icons/fa';
import { useGameContext } from 'src/context/gameContext';
import ProgressBorderCustomizer from './ProgressBorderCustomizer';

const Settings = () =>
{
  const {
    soundOff,
    musicOff,
    setMusicOff,
    setSoundOff,
    setShowSettingsModal,
    progressBorderSettings,
    setProgressBorderSettings
  } = useGameContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="
        relative w-full max-w-md rounded-2xl shadow-2xl border border-white/20
        bg-gradient-to-br from-[#e0b0ff]/95 via-white/90 to-[#ffe5ec]/95
        p-0 overflow-hidden
      ">
        {/* Decorative gradient top bar */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-300" />

        {/* Close button */}
        <button
          onClick={() => setShowSettingsModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-400 bg-white/40 rounded-full p-1 shadow"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col gap-6 px-8 py-8">
          {/* Header */}
          <h2 className="text-xl font-bold text-center text-[#8B4513] drop-shadow-sm">Settings</h2>

          {/* Toggles */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#704337]">Music</span>
              <img
                src={`assets/modal/setting/${musicOff ? 'off.png' : 'on.png'}`}
                alt="Music toggle"
                className="cursor-pointer w-10 h-6 drop-shadow-md hover:scale-105 transition"
                onClick={() => setMusicOff(!musicOff)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#704337]">Sound</span>
              <img
                src={`assets/modal/setting/${soundOff ? 'off.png' : 'on.png'}`}
                alt="Sound toggle"
                className="cursor-pointer w-10 h-6 drop-shadow-md hover:scale-105 transition"
                onClick={() => setSoundOff(!soundOff)}
              />
            </div>
          </div>

          {/* Progress Border Customizer */}
          <ProgressBorderCustomizer
            settings={progressBorderSettings} //i got error here :' that make me cant build the app
            onChange={setProgressBorderSettings}
          />
        </div>

        {/* Decorative gradient bottom bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
      </div>
    </div>
  );
};

export default Settings;
