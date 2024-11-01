// src/app/test/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { dbPet } from '@/localDB/pet.db';  // Nhập dbPet từ tệp db của bạn

const TestPage = () => {
    const [petBId, setPetBId] = useState('');
    const [response, setResponse] = useState(null);
    const [petAInfo, setPetAInfo] = useState({pet_id: '', pet_name: '', pet_image: '' });

    useEffect(() => {
        const fetchSelectedPet = async () => {
            const selectedPets = await dbPet.selected.toArray();
            if (selectedPets.length > 0) {
                const firstSelectedPet = selectedPets[0];
                setPetAInfo({pet_id: firstSelectedPet.pet_id, pet_name: firstSelectedPet.pet_name, pet_image: firstSelectedPet.pet_image });
            }
        };

        fetchSelectedPet();
    }, []);

    const handleLike = async () => {
        const res = await fetch(`/api/pet/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                petAId: petAInfo.pet_id,
                petBId: petBId,
                pet_name: petAInfo.pet_name,
                pet_image: petAInfo.pet_image,
            }),
        });
    
        const data = await res.json();
        setResponse(data);
    
        if (data?.matchedItem) {
            const { room_id,pet_id,owner_partner_id, partner_id, partner_avatar, partner_name, created_at } = data.matchedItem;
    
            try {
                await dbPet.matched.add({
                    room_id,
                    pet_id,
                    owner_partner_id,
                    partner_id,
                    partner_avatar,
                    partner_name,
                    created_at
                });
                console.log('Matched item đã được thêm vào dbPet.matched');
            } catch (error) {
                console.error('Lỗi khi thêm matched item vào db:', error);
            }
        }
    };
    

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center text-secondary">PETMATCH TEST</h1>
            
            {petAInfo.pet_id && (
                <div className="mb-4 text-center flex flex-col justify-center items-center">
                    <img
                        src={petAInfo.pet_image}
                        alt={petAInfo.pet_name}
                        className="h-24 w-24 rounded-full object-cover mb-2"
                    />
                    <p className="font-medium text-black">ID: {petAInfo.pet_id}</p>
                    <p className="font-medium  text-black">Name: {petAInfo.pet_name}</p>
                </div>
            )}
    
            
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Pet B ID"
                    value={petBId}
                    onChange={(e) => setPetBId(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-60 text-black"
                />
            </div>
            <button
                onClick={handleLike}
                className="bg-secondary text-black rounded-xl px-10 py-2 hover:bg-blue-600 transition"
            >
                Like
            </button>
            {response && <div className="mt-4 text-green-600">{JSON.stringify(response)}</div>}
        </div>
    );
    
    
};

export default TestPage;
