'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { dbPet } from '@/localDB/pet.db';
import { MatchedItem } from '@/app/model/petMatchedItem';
import { pusherClient } from '@/lib/pusher';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';

const MatchingSection: React.FC = () => {
    const router = useRouter();
    const selectedPets = useLiveQuery(() => dbPet.selected.toArray(), []);
    const firstSelectedPet = selectedPets?.[0];
    const matched = useLiveQuery(
        () => firstSelectedPet ? dbPet.matched.where({ pet_id: firstSelectedPet.pet_id }).toArray() : [],
        [firstSelectedPet]
    );
    useEffect(() => {
        if (!firstSelectedPet) return;
        const petId = firstSelectedPet.pet_id;
        const channel = pusherClient.subscribe(`private-pet-${petId}`);
        channel.bind('matched', async (data: MatchedItem) => {
            console.log('Received match notification:', data);
            await dbPet.matched.put(data);
        });
        return () => {
            pusherClient.unsubscribe(`private-pet-${petId}`);
        };
    }, [firstSelectedPet]);

    useEffect(() => {
        const fetchMatched = async () => {
            if (firstSelectedPet) {
                const petId = firstSelectedPet.pet_id;
                const existingRecord = await dbPet.matched.where('pet_id').equals(petId).first();
                if (existingRecord) {
                    return; // Nếu đã có, bỏ qua phần còn lại của useEffect
                }
                try {
                    const response = await axios.get(`/api/pet/getMyMatched/${petId}`);
                    const fetchedMatched = response.data.matched;
                    await dbPet.matched.bulkPut(fetchedMatched); // Dexie sẽ cập nhật truy vấn trực tiếp
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error('Error fetching matched data:', error.response?.data.message || error.message);
                    } else {
                        console.error('Unexpected error:', error);
                    }
                }
            }
        };

        fetchMatched();
    }, [firstSelectedPet]);


    const getRelativeTime = (createdAt: string): string => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        }
    };

    const handleChatClick = (roomId: string) => {
        router.push(`/chat/${roomId}`);
    };
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {matched && matched.length > 0 ? (
                matched.map((match) => (
                    <div
                        key={match.room_id}
                        className="relative group border-2 border-gray-300 rounded-lg p-1 transition-all duration-300 transform hover:scale-110 hover:border-yellow-400"
                        onClick={() => handleChatClick(match.room_id)}
                    >
                        <img
                            src={match.partner_avatar}
                            alt={match.partner_name}
                            className="w-24 h-28 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2">
                            <h3 className="text-white text-sm font-bold">{match.partner_name}</h3>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center text-gray-500">
                    Chưa có tương hợp nào
                </div>
            )}
        </div>

    );
};

export default MatchingSection;
