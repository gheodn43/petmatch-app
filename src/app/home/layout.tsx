'use client'
import React, { useState } from 'react';

export default function MainPageLayout({ 
    children, side, main
}: { 
    children: React.ReactNode
    side: React.ReactNode
    main: React.ReactNode
}) {
    const [sideWidth, setSideWidth] = useState(20); // Default side width in percentage

    const handleMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = sideWidth;

        const onMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + ((e.clientX - startX) / window.innerWidth) * 100;
            setSideWidth(Math.max(10, Math.min(50, newWidth))); // Constrain between 10% and 50%
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="flex h-screen">
            {children}
            <div className="flex-none bg-primary" style={{ width: `${sideWidth}%` }}>
                {side}
            </div>
            <div
                className="w-1 bg-tertiary cursor-col-resize"
                onMouseDown={handleMouseDown}
                style={{ height: '100%' }}
            ></div>
            <div className="flex-1 bg-white">
                {main}
            </div>
        </div>
    );
}
