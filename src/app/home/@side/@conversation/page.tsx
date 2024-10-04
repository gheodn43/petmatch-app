'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { dbPet } from '@/localDB/pet.db';
import { useHomeContext } from '@/providers/HomeContext';

export default function ConversationSection() {
    const router = useRouter();
    const { setHomeActiveView } = useHomeContext();
    const selectedPets = useLiveQuery(() => dbPet.selected.toArray(), []);
    const firstSelectedPet = selectedPets?.[0];
    const conversations = useLiveQuery(
        () => firstSelectedPet ? dbPet.conversation.where({ pet_id: firstSelectedPet.pet_id }).toArray() : [],
        [firstSelectedPet]
    );

    const handleChatClick = async (roomId: string) => {
        await router.push(`/chat/${roomId}`);
        setHomeActiveView('main');
    };

    const formatSentAt = (sentAt: string) => {
        const date = new Date(sentAt);
        const now = new Date();

        const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const timeString = date.toLocaleTimeString('vi-VN', options);

        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return timeString;  
        }

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const isThisWeek = date >= startOfWeek && date <= endOfWeek;

        if (isThisWeek) {
            const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            const dayName = daysOfWeek[date.getDay()];
            return `${dayName} ${timeString}`;
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month} ${timeString}`;
    };

    return (
        <div className='px-4 py-4 md:py-0'>
            <h3 className="text-secondary font-sans font-bold block md:hidden">Trò chuyện.</h3>
            {conversations && conversations.length > 0 ? (
                <div className="flex flex-col space-y-2">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.room_id}
                            className="flex flex-row space-x-4 py-3 px-2 bg-primary w-full items-center cursor-pointer"
                            onClick={() => handleChatClick(conversation.room_id)}
                        >
                            <img
                                src={conversation.partner_avatar}
                                alt={conversation.partner_name}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <div className="bottom-2 left-2 flex-1">
                                <h3 className="text-gray-500 text-sm font-black">{conversation.partner_name}</h3>
                                <div className='flex items-center space-x-4'>
                                    <h3 className="text-gray-500 text-sm">
                                        {firstSelectedPet?.pet_id === conversation.last_message.sender_id ? 'Bạn: ' : ''}
                                        {conversation.last_message.content}
                                    </h3>
                                    <span className="text-gray-400 text-xs">{formatSentAt(conversation.sent_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-3 text-center text-gray-500">
                    Chưa có cuộc trò chuyện
                </div>
            )}
        </div>
    );
}
