// components/Tooltip.tsx
import React, { ReactNode } from "react";

type TooltipProps = {
    text: string;
    children: ReactNode;
};

const Tooltip = ({ text, children }: TooltipProps) => (
    <div className="relative group inline-block">
        {children}
        <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none shadow-lg">
            {text}
        </div>
    </div>
);

export default Tooltip;
