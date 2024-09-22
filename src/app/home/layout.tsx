'use client';
import React from 'react';
import { UserProvider } from '@/providers/UserContext';

export default function MainPageLayout({
    children, side, main
}: { 
    children?: React.ReactNode
    side: React.ReactNode
    main: React.ReactNode
}) {
    return (
        <UserProvider>
            <div className="flex h-screen">
                {children} {/* Optional for wrapping extra content */}
                
                {/* Sidebar */}
                <div className="flex-none bg-primary w-[25%] sm:w-[30%] md:w-[32%] lg:w-[20%] xl:w-[18%] overflow-y-auto h-full">
                    {side}
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white p-4 overflow-y-auto h-full">
                    {main}
                </div>
            </div>
        </UserProvider>
    );
}
