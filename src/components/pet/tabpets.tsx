'use client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

type Pet = {
  pet_id: string;
  pet_name: string;
  pet_age: string;
  pet_type: string;
  pet_img1: string;
};

type TabPetsProps = {
  pets: Pet[];
};


const TabPets: React.FC<TabPetsProps> = ({ pets }) => {
    const router = useRouter();
    const handleOpenCreateNewPet = () => {
        router.push('/pet/add-pet')
    };
    const handleChangePetView = (pet_id: string) => {
      console.log(`View details of pet with id: ${pet_id}`);
    };
  return (
    <div className="flex items-center space-x-2 h-16 p-4 border-b-2 border-solid border-tertiary">
      {pets.map((pet) => (
        <div
          key={pet.pet_id}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleChangePetView(pet.pet_id)} // Xử lý khi click vào ảnh pet
        >
          <img
            src={pet.pet_img1}
            alt={pet.pet_name}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      ))}
      <div className="flex flex-col items-center justify-center">
        <button
          className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded-full"
          onClick={handleOpenCreateNewPet} // Xử lý khi click vào dấu +
        >
          <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TabPets;
