// components/Confetti.tsx
import React from "react";

const Confetti = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        {/* Simple SVG confetti burst */}
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <g>
                <circle cx="90" cy="90" r="6" fill="#FFD700" />
                <circle cx="30" cy="30" r="3" fill="#FF69B4" />
                <circle cx="150" cy="40" r="4" fill="#00CFFF" />
                <circle cx="40" cy="150" r="5" fill="#FFB347" />
                <circle cx="160" cy="130" r="3" fill="#90EE90" />
                <circle cx="120" cy="160" r="2.5" fill="#FF69B4" />
                {/* Add more for effect */}
            </g>
        </svg>
        <span className="absolute text-4xl font-bold text-yellow-400 animate-bounce drop-shadow-lg">🎉</span>
    </div>
);

export default Confetti;
