import React from "react";

type ProgressBorderProps = {
    progress: number; // 0 to 1 (0 = no progress, 1 = complete)
    size: number;
    strokeWidth?: number;
    color?: string;
    borderRadius?: number;
    variant?: 'glow' | 'pulse' | 'gradient' | 'rainbow';
    position?: 'overlay' | 'behind' | 'inset';
};

const ProgressBorder = ({
    progress,
    size,
    strokeWidth = 12,
    color = "#FFD700",
    borderRadius = 24,
    variant = 'gradient',
    position = 'behind'
}: ProgressBorderProps) =>
{
    const r = borderRadius;
    const width = size - strokeWidth;
    const height = size - strokeWidth;
    // Perimeter of rounded rectangle: 2*(w+h-2r) + 2*pi*r
    const perimeter = 2 * (width + height - 2 * r) + 2 * Math.PI * r;
    const offset = perimeter * (1 - progress);

    const getZIndex = () =>
    {
        switch (position)
        {
            case 'behind': return -1;
            case 'inset': return 25;
            case 'overlay':
            default: return 30;
        }
    };

    const getFilter = () =>
    {
        switch (variant)
        {
            case 'glow':
                return `drop-shadow(0 0 12px ${color}88) drop-shadow(0 0 6px ${color}44)`;
            case 'pulse':
                return `drop-shadow(0 0 16px ${color}99) brightness(1.2)`;
            case 'gradient':
            case 'rainbow':
                return `drop-shadow(0 0 12px ${color}66) drop-shadow(0 0 24px ${color}33)`;
            default:
                return `drop-shadow(0 0 10px ${color}88)`;
        }
    };

    const getAnimationClass = () =>
    {
        switch (variant)
        {
            case 'pulse':
                return 'animate-pulse';
            case 'rainbow':
                return 'animate-pulse';
            default:
                return '';
        }
    };

    // Create unique gradient IDs
    const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`;
    const movingGradientId = `moving-gradient-${Math.random().toString(36).substr(2, 9)}`;
    const rainbowGradientId = `rainbow-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{ zIndex: getZIndex() }}
        >
            <svg
                width={size}
                height={size}
                className={`${getAnimationClass()}`}
                style={{
                    filter: getFilter(),
                }}
            >
                {/* Define gradients and animations */}
                <defs>
                    {/* Standard gradient */}
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="25%" stopColor="#FF6B35" />
                        <stop offset="50%" stopColor="#F7931E" />
                        <stop offset="75%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>

                    {/* Moving gradient with animation */}
                    <linearGradient id={movingGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFD700">
                            <animate attributeName="stop-color"
                                values="#FFD700;#FF6B35;#F7931E;#FFD700"
                                dur="3s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="33%" stopColor="#FF6B35">
                            <animate attributeName="stop-color"
                                values="#FF6B35;#F7931E;#FFD700;#FF6B35"
                                dur="3s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="66%" stopColor="#F7931E">
                            <animate attributeName="stop-color"
                                values="#F7931E;#FFD700;#FF6B35;#F7931E"
                                dur="3s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#FFD700">
                            <animate attributeName="stop-color"
                                values="#FFD700;#FF6B35;#F7931E;#FFD700"
                                dur="3s"
                                repeatCount="indefinite" />
                        </stop>

                        {/* Animate the gradient position */}
                        <animateTransform
                            attributeName="gradientTransform"
                            type="rotate"
                            values="0;360"
                            dur="6s"
                            repeatCount="indefinite"
                        />
                    </linearGradient>

                    {/* Rainbow gradient */}
                    <linearGradient id={rainbowGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff0000">
                            <animate attributeName="stop-color"
                                values="#ff0000;#ff8800;#ffff00;#88ff00;#00ff00;#00ff88;#00ffff;#0088ff;#0000ff;#8800ff;#ff00ff;#ff0088;#ff0000"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="16%" stopColor="#ff8800">
                            <animate attributeName="stop-color"
                                values="#ff8800;#ffff00;#88ff00;#00ff00;#00ff88;#00ffff;#0088ff;#0000ff;#8800ff;#ff00ff;#ff0088;#ff0000;#ff8800"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="33%" stopColor="#ffff00">
                            <animate attributeName="stop-color"
                                values="#ffff00;#88ff00;#00ff00;#00ff88;#00ffff;#0088ff;#0000ff;#8800ff;#ff00ff;#ff0088;#ff0000;#ff8800;#ffff00"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="#00ff00">
                            <animate attributeName="stop-color"
                                values="#00ff00;#00ff88;#00ffff;#0088ff;#0000ff;#8800ff;#ff00ff;#ff0088;#ff0000;#ff8800;#ffff00;#88ff00;#00ff00"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="66%" stopColor="#00ffff">
                            <animate attributeName="stop-color"
                                values="#00ffff;#0088ff;#0000ff;#8800ff;#ff00ff;#ff0088;#ff0000;#ff8800;#ffff00;#88ff00;#00ff00;#00ff88;#00ffff"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="83%" stopColor="#0000ff">
                            <animate attributeName="stop-color"
                                values="#0000ff;#8800ff;#ff00ff;#ff0088;#ff0000;#ff8800;#ffff00;#88ff00;#00ff00;#00ff88;#00ffff;#0088ff;#0000ff"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#ff00ff">
                            <animate attributeName="stop-color"
                                values="#ff00ff;#ff0088;#ff0000;#ff8800;#ffff00;#88ff00;#00ff00;#00ff88;#00ffff;#0088ff;#0000ff;#8800ff;#ff00ff"
                                dur="4s"
                                repeatCount="indefinite" />
                        </stop>
                    </linearGradient>

                    {/* Glowing filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background border (subtle) */}
                <rect
                    x={strokeWidth / 2}
                    y={strokeWidth / 2}
                    width={width}
                    height={height}
                    rx={r}
                    ry={r}
                    stroke="#ffffff15"
                    strokeWidth={strokeWidth + 4}
                    fill="none"
                />

                {/* Secondary background border */}
                <rect
                    x={strokeWidth / 2}
                    y={strokeWidth / 2}
                    width={width}
                    height={height}
                    rx={r}
                    ry={r}
                    stroke="#ffffff08"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Main progress border */}
                <rect
                    x={strokeWidth / 2}
                    y={strokeWidth / 2}
                    width={width}
                    height={height}
                    rx={r}
                    ry={r}
                    stroke={
                        variant === 'gradient' ? `url(#${gradientId})` :
                            variant === 'rainbow' ? `url(#${rainbowGradientId})` :
                                color
                    }
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={perimeter}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    filter={variant === 'glow' ? 'url(#glow)' : undefined}
                    style={{
                        transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformOrigin: 'center'
                    }}
                />

                {/* Inner glow effect for enhanced variants */}
                {(variant === 'glow' || variant === 'pulse' || variant === 'gradient') && progress > 0 && (
                    <rect
                        x={strokeWidth / 2 + 4}
                        y={strokeWidth / 2 + 4}
                        width={width - 8}
                        height={height - 8}
                        rx={r - 4}
                        ry={r - 4}
                        stroke={variant === 'gradient' ? `url(#${gradientId})` : color}
                        strokeWidth={Math.max(2, strokeWidth / 3)}
                        fill="none"
                        strokeDasharray={perimeter * 0.92}
                        strokeDashoffset={offset * 0.92}
                        opacity="0.6"
                        style={{
                            transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    />
                )}

                {/* Sparkle effects for special variants */}
                {(variant === 'rainbow') && progress > 0.3 && (
                    <>
                        <circle cx={size * 0.2} cy={size * 0.2} r="2" fill="#fff" opacity="0.8">
                            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={size * 0.8} cy={size * 0.3} r="1.5" fill="#fff" opacity="0.6">
                            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={size * 0.7} cy={size * 0.8} r="1" fill="#fff" opacity="0.7">
                            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                    </>
                )}
            </svg>

            {/* Progress percentage overlay */}
            {progress > 0.05 && variant !== 'rainbow' && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                        color: variant === 'gradient' ? '#FFD700' : color,
                        fontSize: Math.max(12, size * 0.04),
                        fontWeight: 'bold',
                        textShadow: `0 0 8px ${color}44, 0 0 4px ${color}88`,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                >
                    {Math.round(progress * 100)}%
                </div>
            )}
        </div>
    );
};

export default ProgressBorder;