'use client'

import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { dbPet } from '@/localDB/pet.db';

interface MessageFieldProps {
    roomId: string
}

const MessageField: FC<MessageFieldProps> = ({ roomId }) => {
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
    }, []);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        await axios.post(`/api/chat/${roomId}/send`, {
            message: newMessage,
            senderId: petInfo.pet_id,
            senderName: petInfo.pet_name
        });
        setNewMessage(''); // Reset input
    }

    return (
        <div className='flex gap-2'>
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
    )
}

export default MessageField;
