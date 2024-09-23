'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { pusherClient } from '@/lib/pusher';
import { Message } from '@/app/model/message';
import { dbPet } from '@/localDB/pet.db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ChatPage: React.FC = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [petInfo, setPetInfo] = useState({ pet_id: '', pet_name: '' });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const router = useRouter();

    // Cuộn xuống khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSelectedPet = async () => {
            const selectedPets = await dbPet.selected.toArray();
            if (selectedPets.length > 0) {
                const firstSelectedPet = selectedPets[0];
                setPetInfo({ pet_id: firstSelectedPet.pet_id, pet_name: firstSelectedPet.pet_name });
            }
        };

        const fetchMessages = async () => {
            try {
                setLoadingMessages(true); // Đặt trạng thái đang tải tin nhắn
                const response = await axios.get(`/api/chat/${roomId}/messages`);
                setMessages(response.data);
                scrollToBottom(); // Cuộn xuống khi fetch xong tin nhắn
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoadingMessages(false); // Hoàn tất việc tải tin nhắn
            }
        };

        fetchSelectedPet();
        fetchMessages();

        const channel = pusherClient.subscribe(`private-chat-${roomId}`);

        // Lắng nghe sự kiện new-message
        channel.bind('new-message', (message: Message) => {
            // Kiểm tra nếu tin nhắn đã tồn tại, tránh việc thêm trùng lặp
            setMessages((prevMessages) => {
                const exists = prevMessages.some((msg) => msg.id === message.id);
                if (!exists) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
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
            scrollToBottom(); // Cuộn xuống khi gửi xong tin nhắn
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false); // Xử lý hoàn tất
        }
    };

    // Hàm xử lý khi nhấn phím Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    const handleBack = () => {
        router.back(); // Quay lại trang trước đó
      };
    return (
        <div className="flex flex-col">
            <div className='flex space-x-4 bg-white py-3 px-6 fixed top-16 left-[25%] sm:left-[30%] md:left-[32%] lg:left-[20%] xl:left-[18%] right-0'>
                <FontAwesomeIcon icon={faArrowLeft} className='text-gray-400 cursor-pointer text-lg' onClick={handleBack}/> 
            </div>
            <div className='overflow-hidden'>
                {loadingMessages ? (
                    <div className="flex-grow p-4 bg-white flex items-center justify-center">
                        <p className="text-gray-500">Đang tải tin nhắn...</p>
                    </div>
                ) : (!messages || messages.length === 0) ? (
                    <div className="flex-grow p-4 bg-white flex items-center justify-center">
                        <p className="text-gray-500">Không có tin nhắn nào để hiển thị.</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-4 bg-white">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`mb-2 flex ${msg.senderId === petInfo.pet_id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg shadow ${msg.senderId === petInfo.pet_id ? ' bg-[#FFD971] text-gray-900' : 'bg-[#FFF9E4] text-gray-900'}`}>
                                    <div className="text-sm">{msg.content}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 left-[25%] sm:left-[30%] md:left-[32%] lg:left-[20%] xl:left-[18%] right-0 z-10 p-4 bg-gray-50 flex">
                <button
                    onClick={sendMessage}
                    className={`mr-2 p-2 pl-8 pr-8 text-center rounded ${isSending ? 'bg-gray-500 text-white' : 'border-secondary text-gray-500 bg-primary border-2 flex items-center justify-center'}`}
                    disabled={isSending}
                >
                    {isSending ? 'Đang gửi...' : 'Gửi'}
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow border border-gray-300 rounded p-2 text-gray-900"
                    placeholder="Nhập tin nhắn..."
                    disabled={isSending}
                />
            </div>
        </div>
    );

};

export default ChatPage;
