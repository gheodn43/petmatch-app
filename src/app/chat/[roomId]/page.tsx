'use client';
import React, { useEffect, useState, useRef } from 'react';
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
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref để tự động cuộn xuống khi có tin nhắn mới
    const [isSending, setIsSending] = useState(false);  // Trạng thái khi tin nhắn đang được gửi

    // Cuộn xuống khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSelectedPet = async () => {
            const selectedPets = await dbPet.selected.toArray();
            if (selectedPets.length > 0) {
                const firstSelectedPet = selectedPets[0];
                setPetInfo({pet_id: firstSelectedPet.pet_id, pet_name: firstSelectedPet.pet_name });
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chat/${roomId}/messages`);
                setMessages(response.data);
                scrollToBottom(); // Cuộn xuống khi fetch xong tin nhắn
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchSelectedPet();
        fetchMessages();

        const channel = pusherClient.subscribe(`private-chat-${roomId}`);
        channel.bind('new-message', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom(); // Cuộn xuống khi nhận tin nhắn mới
        });

        return () => {
            pusherClient.unsubscribe(`private-chat-${roomId}`);
        };
    }, [roomId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        setIsSending(true); // Bắt đầu gửi tin nhắn
        try {
            await axios.post(`/api/chat/${roomId}/send`, { 
                message: newMessage, 
                senderId: petInfo.pet_id,
                senderName: petInfo.pet_name 
            });
            setNewMessage(''); // Reset nội dung input
            setIsSending(false); // Gửi xong
            scrollToBottom(); // Cuộn xuống khi gửi xong tin nhắn
        } catch (error) {
            console.error('Error sending message:', error);
            setIsSending(false); // Xử lý lỗi khi gửi tin nhắn
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {(!messages || messages.length === 0) ? (
                <div className="flex-grow p-4 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Không có tin nhắn nào để hiển thị.</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`mb-2 flex ${msg.senderId === petInfo.pet_id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-lg shadow ${msg.senderId === petInfo.pet_id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gradient-to-r from-green-400 to-teal-400 text-white'}`}>
                                <div className="text-sm">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
            <div className="p-4 bg-white flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow border border-gray-300 rounded p-2"
                    placeholder="Nhập tin nhắn..."
                    disabled={isSending}  // Disable khi đang gửi tin nhắn
                />
                <button
                    onClick={sendMessage}
                    className={`ml-2 p-2 rounded ${isSending ? 'bg-gray-500' : 'bg-blue-500 text-white'}`}
                    disabled={isSending}  // Disable khi đang gửi tin nhắn
                >
                    {isSending ? 'Đang gửi...' : 'Gửi'}
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
