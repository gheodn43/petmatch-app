'use client';
import React, { useState } from 'react';
import { UserProvider } from '@/providers/UserContext';
export default function ProfilePageLayout({
    children, side, main
}: {
    children?: React.ReactNode
    side: React.ReactNode
    main: React.ReactNode
}) {
    
    return (
        <UserProvider>
            <div className="h-screen">
                {children}
                <div className="h-full w-full flex">
                    {/* Side view */}
                    <div className={`bg-primary overflow-y-auto h-full  md:flex-none md:block md:w-[325px] lg:w-[350px] xl:w-[400px]`}>
                        {side}
                    </div>

                    {/* Main view */}
                    <div className={`bg-gray-100 overflow-y-auto h-full py-16'flex-1' : 'hidden'} md:block md:flex-1`}>
                        {main}
                    </div>
                </div>
            </div>
        </UserProvider>
    );
}
