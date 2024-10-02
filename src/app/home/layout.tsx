'use client';
import React, { useState } from 'react';
import { UserProvider } from '@/providers/UserContext';
import TabPets from '@/components/pet/tabpets';
import { PetOverviewDto } from '../model/pet';
import { dbPet } from '@/localDB/pet.db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function MainPageLayout({
    children, side, main
}: {
    children?: React.ReactNode
    side: React.ReactNode
    main: React.ReactNode
}) {
    const [activeView, setActiveView] = useState<string>('main');
    const [error, setError] = useState<string | null>(null);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);

    // Sử dụng useLiveQuery để tự động cập nhật pets khi localDB thay đổi
    const pets = useLiveQuery(async () => {
        const localPets = await dbPet.pet.toArray();
        if (localPets.length > 0) {
            return localPets;
        } else {
            const response = await fetch('/api/pet/getMyPets');
            if (response.ok) {
                const data = await response.json();
                await dbPet.pet.bulkAdd(data.pets);
                return data.pets;
            } else if (response.status === 401) {
                setError('Unauthorized. Please login again.');
            } else if (response.status === 404) {
                setIsNotFound(true);
            } else if (response.status === 500) {
                setError('Internal server error. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
            return [];
        }
    }, []); // Dependencies: chỉ gọi lại khi component mount

    return (
        <UserProvider>
            <div className="h-screen">
                <div className='fixed top-0 left-0 md:left-[325px] lg:left-[350px] xl:left-[400px] right-0 z-11'>
                    <TabPets pets={pets || []} />
                </div>
                {children}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around h-16">
                    <button
                        className={`flex-1 text-center py-2 cursor-pointer ${activeView === 'main' ? 'bg-gray-600' : ''}`}
                        onClick={() => setActiveView('main')}
                    >
                        Recs
                    </button>
                    <button
                        className={`flex-1 text-center py-2 ${activeView === 'side' ? 'bg-gray-600' : ''}`}
                        onClick={() => setActiveView('side')}
                    >
                        Matches
                    </button>
                </div>
                <div className="h-full w-full flex">
                    {/* Side view */}
                    <div className={`bg-primary overflow-y-auto h-full ${activeView === 'side' ? 'flex-1' : 'hidden'} md:flex-none md:block md:w-[325px] lg:w-[350px] xl:w-[400px]`}>
                        {side}
                    </div>

                    {/* Main view */}
                    <div className={`bg-white overflow-y-auto h-full py-16 ${activeView === 'main' ? 'flex-1' : 'hidden'} md:block md:flex-1`}>
                        {main}
                    </div>
                </div>
            </div>
        </UserProvider>
    );
}
