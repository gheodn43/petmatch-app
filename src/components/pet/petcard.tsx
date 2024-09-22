'use client';
import React from 'react';
//import { PetOverviewDto } from '@/app/model/pet';
import { dbPet } from '@/localDB/pet.db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function PetCard() {
  // Lấy dữ liệu từ Dexie
  const selectedPets = useLiveQuery(() => dbPet.selected.toArray(),[]);
  if (!selectedPets) {
    return <p>Loading...</p>;
  }
  const firstPet = selectedPets.length > 0 ? selectedPets[0] : null;

  return (
    <div className="flex flex-col items-center text-black pt-11">
      {firstPet ? (
        <div className="pet-card">
          <img src={firstPet.pet_image} alt={firstPet.pet_name} className="pet-image w-[200px]" />
          <h3>{firstPet.pet_name}</h3>
          <p>Type: {firstPet.pet_type}</p>
          <p>Species: {firstPet.pet_species}</p>
          <p>Gender: {firstPet.pet_gender}</p>
          <p>Status: {firstPet.pet_status}</p>
        </div>
      ) : (
        <p>No selected pets found.</p>
      )}
    </div>
  );
}
