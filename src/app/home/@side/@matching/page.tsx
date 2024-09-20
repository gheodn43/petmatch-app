'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { dbPet } from '@/localDB/pet.db'; 
import { MatchedItem } from '@/app/model/petMatchedItem';
import { pusherClient } from '@/lib/pusher'; 
import { useRouter } from 'next/navigation';  // Sử dụng router để điều hướng

const MatchingSection: React.FC = () => {
    const [matched, setMatched] = useState<MatchedItem[]>([]);
    const [petId, setPetId] = useState('');
    const router = useRouter();  // Khởi tạo router

    useEffect(() => {
        const fetchSelectedPet = async () => {
            const selectedPets = await dbPet.selected.toArray();
            if (selectedPets.length > 0) {
                const firstSelectedPet = selectedPets[0];
                setPetId(firstSelectedPet.pet_id);
            }
        };

        if (petId) {
            const channel = pusherClient.subscribe(`private-pet-${petId}`);
            channel.bind('matched', async (data: MatchedItem) => {
                console.log('Pet nhận được thông báo match:', data);
                setMatched((prevMatched) => [...prevMatched, data]);
                await dbPet.matched.put(data); 
            });

            return () => {
                pusherClient.unsubscribe(`private-pet-${petId}`);
            };
        }

        const fetchMatched = async () => {
            try {
                const matchedData = await dbPet.matched.toArray();
                if (matchedData.length > 0) {
                    setMatched(matchedData);
                } else {
                    const response = await axios.get('/api/pet/getMyMatched');
                    const fetchedMatched = response.data.matched;
                    setMatched(fetchedMatched);
                    await dbPet.matched.bulkPut(fetchedMatched);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error fetching matched data:', error.response?.data.message || error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        };

        fetchSelectedPet();
        fetchMatched();
    }, [petId]);

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
        // Điều hướng tới trang chat với roomId tương ứng
        router.push(`/chat/${roomId}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-primary">
            {matched.map((match) => (
                <div 
                    key={match.room_id} 
                    className="border-2 rounded-lg p-4 border-secondary border:gradient-20 cursor-pointer"
                    onClick={() => handleChatClick(match.room_id)}  // Gọi hàm handleChatClick khi click vào
                >
                    <div className="flex flex-col items-center">
                        <img 
                            src={match.partner_avatar} 
                            alt="Partner Avatar" 
                            className="w-20 h-20 rounded-full mb-2" 
                        />
                        <h3 className="font-bold text-secondary text-lg">{match.partner_name}</h3>
                        <p className="text-black">{getRelativeTime(match.created_at)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MatchingSection;
