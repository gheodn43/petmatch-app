'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { dbPet } from '@/localDB/pet.db'; 

interface MatchedItem {
    room_id: string;
    partner_id: string;
    partner_avatar: string;
    created_at: string;
}

const MatchingSection: React.FC = () => {
    const [matched, setMatched] = useState<MatchedItem[]>([]);

    useEffect(() => {
        const fetchMatched = async () => {
            try {
                // Kiểm tra xem bảng matched có dữ liệu không
                const matchedData = await dbPet.matched.toArray();
                
                if (matchedData.length > 0) {
                    // Nếu có dữ liệu trong bảng matched, lấy dữ liệu từ đây
                    setMatched(matchedData);
                } else {
                    // Nếu chưa có dữ liệu, gọi API để lấy và thêm vào DB
                    const response = await axios.get('/api/pet/getMyMatched');
                    const fetchedMatched = response.data.matched;
                    setMatched(fetchedMatched);
                    
                    // Thêm dữ liệu vào bảng matched
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

        fetchMatched();
    }, []);

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matched.map((match) => (
                <div key={match.room_id} className="border rounded-lg shadow p-4">
                    <div className="flex flex-col items-center">
                        <img 
                            src={match.partner_avatar} 
                            alt="Partner Avatar" 
                            className="w-24 h-24 rounded-full mb-2" 
                        />
                        <h3 className="font-bold text-lg">{match.partner_id}</h3>
                        <p className="text-gray-600">{getRelativeTime(match.created_at)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MatchingSection;
