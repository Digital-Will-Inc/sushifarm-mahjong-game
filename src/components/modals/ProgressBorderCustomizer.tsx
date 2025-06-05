import React from 'react';

export interface ProgressBorderSettings
{
    color: string;
    strokeWidth: number;
    borderRadius: number;
    variant: 'glow' | 'pulse' | 'gradient' | 'rainbow';
    position: 'behind' | 'overlay' | 'inset';
}

const ProgressBorderCustomizer = ({
    settings,
    onChange
}: {
    settings: ProgressBorderSettings;
    onChange: (settings: ProgressBorderSettings) => void;
}) => (
    <div className="
    bg-white/80 backdrop-blur-md rounded-xl shadow
    border border-pink-100/60 px-4 py-4 w-full
  ">
        <h3 className="font-bold mb-3 text-sm text-[#8B4513]">Progress Border Customization</h3>
        <div className="flex flex-col gap-3">
            {/* Color */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#704337]">
                Color:
                <input
                    type="color"
                    value={settings.color}
                    onChange={e => onChange({ ...settings, color: e.target.value })}
                    className="w-6 h-6 border-2 border-gray-200 rounded shadow"
                />
            </label>
            {/* Stroke Width */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#704337]">
                Stroke Width:
                <input
                    type="range"
                    min={1}
                    max={20}
                    value={settings.strokeWidth}
                    onChange={e => onChange({ ...settings, strokeWidth: parseInt(e.target.value) })}
                    className="accent-pink-400"
                />
                <span className="ml-2 text-pink-500">{settings.strokeWidth}</span>
            </label>
            {/* Border Radius */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#704337]">
                Radius:
                <input
                    type="range"
                    min={0}
                    max={80}
                    value={settings.borderRadius}
                    onChange={e => onChange({ ...settings, borderRadius: parseInt(e.target.value) })}
                    className="accent-orange-400"
                />
                <span className="ml-2 text-orange-500">{settings.borderRadius}</span>
            </label>
            {/* Variant */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#704337]">
                Variant:
                <select
                    value={settings.variant}
                    onChange={e =>
                        onChange({
                            ...settings,
                            variant: e.target.value as ProgressBorderSettings['variant']
                        })
                    }
                    className="rounded bg-white/70 border border-gray-200 px-2 py-1 text-xs text-[#8B4513] focus:outline-none"
                >
                    <option value="glow">Glow</option>
                    <option value="pulse">Pulse</option>
                    <option value="gradient">Gradient</option>
                    <option value="rainbow">Rainbow</option>
                </select>
            </label>
            {/* Position */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#704337]">
                Position:
                <select
                    value={settings.position}
                    onChange={e =>
                        onChange({
                            ...settings,
                            position: e.target.value as ProgressBorderSettings['position']
                        })
                    }
                    className="rounded bg-white/70 border border-gray-200 px-2 py-1 text-xs text-[#8B4513] focus:outline-none"
                >
                    <option value="behind">Behind</option>
                    <option value="overlay">Overlay</option>
                    <option value="inset">Inset</option>
                </select>
            </label>
        </div>
    </div>
);

export default ProgressBorderCustomizer;
