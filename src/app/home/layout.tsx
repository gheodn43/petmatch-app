'use client'
import React, { useState } from 'react';
import { UserProvider } from '@/providers/UserContext';
import TabPets from '@/components/pet/tabpets';
import { dbPet } from '@/localDB/pet.db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useHomeContext } from '@/providers/HomeContext';
import { usePetsContext } from '@/providers/PetsContext';
import { usePathname } from 'next/navigation';

export default function MainPageLayout({
    children, side, main
}: {
    children?: React.ReactNode
    side: React.ReactNode
    main: React.ReactNode
}) {
    const { homeActiveView } = useHomeContext();
    const [error, setError] = useState<string | null>(null);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const { setHasPets } = usePetsContext();
    const pathname = usePathname();

    const pets = useLiveQuery(async () => {
        const localPets = await dbPet.pet.toArray();
        if (localPets.length > 0) {
            setHasPets(true);
            return localPets;
        } else {
            const response = await fetch('/api/pet/getMyPets');
            if (response.ok) {
                const data = await response.json();
                await dbPet.pet.bulkAdd(data.pets);
                setHasPets(data.pets.length > 0);
                return data.pets;
            } else if (response.status === 401) {
                setError('Unauthorized. Please login again.');
            } else if (response.status === 404) {
                setIsNotFound(true);
                setHasPets(false);
                return [];
            } else if (response.status === 500) {
                setError('Internal server error. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
            return [];
        }
    }, []);

    const isActive = (path: string): boolean => pathname.includes(path);

    return (
        <UserProvider>
            <div className="h-screen">
                {/* Kiểm tra nếu có /chat để không hiển thị TabPets */}
                {isActive('/chat') ? null : (
                    <div className='fixed top-0 left-0 md:left-[325px] lg:left-[350px] xl:left-[400px] right-0 z-11'>
                        <TabPets pets={pets || []} />
                    </div>
                )}

                {children}
                <div className="h-full w-full flex">
                    <div className={`bg-primary overflow-y-auto h-full ${homeActiveView === 'side' ? 'flex-1' : 'hidden'} md:flex-none md:block md:w-[325px] lg:w-[350px] xl:w-[400px]`}>
                        {side}
                    </div>
                    <div className={`bg-white overflow-y-auto h-full ${isActive('/chat') ? '' : 'py-16'} ${homeActiveView === 'main' ? 'flex-1' : 'hidden'} md:block md:flex-1`}>
                        {main}
                    </div>
                </div>
            </div>
        </UserProvider>
    );
}
