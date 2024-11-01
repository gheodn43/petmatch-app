'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { pusherClient } from '@/lib/pusher';
import { useChatStore } from '@/zustand/store/chatStore';
import { Message } from '@/app/model/message';
import { dbPet } from '@/localDB/pet.db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useHomeContext } from '@/providers/HomeContext';

const ChatPage: React.FC = () => {
    const { roomId } = useParams();
    const roomIdStr = Array.isArray(roomId) ? roomId[0] : roomId;
    const { chatrooms, addMessagesToRoom, updateMessagesForRoom } = useChatStore(); // Lấy dữ liệu từ Zustand
    const [newMessage, setNewMessage] = useState<string>('');
    const [petInfo, setPetInfo] = useState({ pet_id: '', pet_name: '' });
    const [partnerInfo, setPartnerInfo] = useState({ pet_id: '', owner_id: '', pet_name: '', pet_image: '', created_at: '' });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [isNewMatch, setIsNewMatch] = useState<boolean>(false);
    const router = useRouter();
    const { setHomeActiveView } = useHomeContext();
    const messages = chatrooms[roomIdStr] || []; // Lấy tin nhắn từ store Zustand
    const [loadingMessages, setLoadingMessages] = useState(!messages.length); // Chỉ load nếu chưa có tin nhắn

    // Cuộn xuống khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSelectedPet = async () => {
            const selectedPets = await dbPet.selected.toArray();
            if (selectedPets.length > 0) {
                const firstSelectedPet = selectedPets[0];

                // Set pet info from selected pet
                setPetInfo({
                    pet_id: firstSelectedPet.pet_id,
                    pet_name: firstSelectedPet.pet_name
                });

                // Fetch partner info from the matched table
                const matchedPets = await dbPet.matched.where('room_id').equals(roomIdStr).toArray();
                if (matchedPets.length > 0) {
                    setIsNewMatch(true);
                    const firstMatchedPet = matchedPets[0];
                    setPartnerInfo({
                        pet_id: firstMatchedPet.partner_id, // Assuming partner_id corresponds to pet_id in your context
                        owner_id: firstMatchedPet.owner_partner_id,
                        pet_name: firstMatchedPet.partner_name,
                        pet_image: firstMatchedPet.partner_avatar,
                        created_at: firstMatchedPet.created_at
                    });
                } else {
                    setIsNewMatch(false);
                    const conversations = await dbPet.conversation.where('room_id').equals(roomIdStr).toArray();
                    if (conversations.length > 0) {
                        const firstMatchedPet = conversations[0];
                        setPartnerInfo({
                            pet_id: firstMatchedPet.partner_id,
                            owner_id: firstMatchedPet.owner_partner_id,
                            pet_name: firstMatchedPet.partner_name,
                            pet_image: firstMatchedPet.partner_avatar,
                            created_at: ''
                        });
                    } else {
                        setPartnerInfo({ pet_id: '', owner_id: '', pet_name: '', pet_image: '', created_at: '' }); // Reset partner info if not found
                    }
                }
            }
        };


        const fetchMessages = async () => {
            if (!isNewMatch) {
                setLoadingMessages(false);
                return;
            } 
            if (!loadingMessages) return
            try {
                setLoadingMessages(true); // Đặt trạng thái đang tải tin nhắn
                const response = await axios.get(`/api/chat/${roomId}/messages`);
                updateMessagesForRoom(roomIdStr, response.data); // Lưu tin nhắn vào Zustand
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
            addMessagesToRoom(roomIdStr, [message]); // Thêm tin nhắn mới vào Zustand
            scrollToBottom(); // Cuộn xuống khi nhận tin nhắn mới
        });

        return () => {
            pusherClient.unsubscribe(`private-chat-${roomId}`);
        };
    }, [roomId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        setIsSending(true);
        if (isNewMatch) {
            await axios.post(`/api/chat/${roomId}/createConversation`);

            // Xóa bản ghi trong bảng matched
            await dbPet.matched.where('room_id').equals(roomIdStr).delete();

            // Thêm bản ghi mới vào bảng conversation
            await dbPet.conversation.add({
                room_id: roomIdStr,
                pet_id: petInfo.pet_id,
                owner_partner_id: partnerInfo.owner_id,
                partner_id: partnerInfo.pet_id,
                partner_avatar: partnerInfo.pet_image,
                partner_name: partnerInfo.pet_name,
                last_message: {
                    sender_id: petInfo.pet_id,
                    content: newMessage
                },
                sent_at: new Date().toISOString()
            });
        }
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleBack = () => {
        router.back();
        setHomeActiveView('side');
    };
    const handleOpenPetProfile = (petId: string) =>{
        router.push(`/pet/info?petId=${petId}`);
    }

    return (
        <div className="flex flex-col py-16">
            <div className='flex flex-row justify-between items-center  space-x-4 bg-primary py-3 px-6 fixed top-0 left-0 md:left-[325px] lg:left-[350px] xl:left-[400px] right-0 h-16'>
                <FontAwesomeIcon icon={faArrowLeft} className='text-gray-400 cursor-pointer text-lg' onClick={handleBack} />
                <div className='flex space-x-3 items-center'>
                    <img
                        src={partnerInfo.pet_image}
                        alt={partnerInfo.pet_name}
                        className={`h-10 w-10 rounded-full object-cover`}
                        onClick={()=>handleOpenPetProfile(partnerInfo.pet_id)}
                    />
                    <p className='text-gray-400 font-sans font-black'>{partnerInfo.pet_name}</p>
                </div>
                <img src='/images/logo-color.png' className='h-14' />
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
                        {Array.from(new Set(messages.map(msg => msg.id))).map((id) => {
                            const msg = messages.find(m => m.id === id); // Lấy tin nhắn đầu tiên với id đó

                            // Kiểm tra xem msg có tồn tại không
                            if (!msg) return null; // Nếu không có, không hiển thị gì

                            return (
                                <div key={id} className={`mb-2 flex ${msg.senderId === petInfo.pet_id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-2 rounded-lg shadow ${msg.senderId === petInfo.pet_id ? ' bg-[#FFD971] text-gray-900' : 'bg-[#FFF9E4] text-gray-900'}`}>
                                        <div className="text-sm">{msg.content}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                )}
            </div>
            <div className="fixed bottom-0 left-0 md:left-[325px] lg:left-[350px] xl:left-[400px] right-0 z-10 p-4 bg-gray-50 flex">
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
