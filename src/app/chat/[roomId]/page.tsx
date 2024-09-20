'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { pusherClient } from '@/lib/pusher'; // Pusher client
import { Message } from '@/app/model/message';
import { dbPet } from '@/localDB/pet.db';

const ChatPage: React.FC = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [petInfo, setPetInfo] = useState({pet_id: '', pet_name: ''});
    useEffect(() => {
        const fetchSelectedPet = async () => {
            const selectedPets = await dbPet.selected.toArray();
            if (selectedPets.length > 0) {
                const firstSelectedPet = selectedPets[0];
                setPetInfo({pet_id: firstSelectedPet.pet_id, pet_name: firstSelectedPet.pet_name });
            }
        };
        fetchSelectedPet();
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chat/${roomId}/messages`);
                console.log(response.data);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();

        console.log('point 1')
        const channel = pusherClient.subscribe(`private-chat-${roomId}`);
        channel.bind('new-message', (message: Message) => {
            console.log('point 2')
            setMessages((prevMessages) => Array.isArray(prevMessages) ? [...prevMessages, message] : [message]);
        });

        return () => {
            pusherClient.unsubscribe(`private-chat-${roomId}`);
        };
    }, [roomId]);
    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        console.log('called')
        try {
            await axios.post(`/api/chat/${roomId}/send`, { 
                message: newMessage, 
                senderId: petInfo.pet_id,
                senderName: petInfo.pet_name 
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    return (
        <div className="flex flex-col h-full">
            {(!messages || messages.length === 0) ? (
                <div className="flex-grow p-4 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Không có tin nhắn nào để hiển thị.</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
                    {messages.map((msg) => (
                        <div key={msg.id} className="mb-2">
                            <div className="text-sm text-gray-500">{msg.senderName}</div>
                            <div className="p-2 bg-white rounded shadow">{msg.content}</div>
                        </div>
                    ))}
                </div>
            )}
            <div className="p-4 bg-white flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow border border-gray-300 rounded p-2"
                    placeholder="Nhập tin nhắn..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white p-2 rounded"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
    
};

export default ChatPage;