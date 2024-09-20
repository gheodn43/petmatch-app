'use client';
import React from 'react';
import { UserProvider } from '@/providers/UserContext'; // Import UserProvider từ file đã tạo

export default function MainPageLayout({ 
    children, side, main
}: { 
    children: React.ReactNode
    side: React.ReactNode
    main: React.ReactNode
}) {
    return (
        <UserProvider>
            <div className="flex h-screen">
                {children}
                <div className="flex-none bg-primary w-[45%] sm:w-[42%] md:w-[40%] lg:w-[32%] xl:w-[20%]">
                    {side}
                </div>
                <div className="flex-1 bg-white">
                    {main}
                </div>
            </div>
        </UserProvider>
    );
}
