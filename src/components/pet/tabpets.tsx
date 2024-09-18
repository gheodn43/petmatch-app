'use client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { PetOverviewDto } from '@/app/model/pet';

type TabPetsProps = {
  pets: PetOverviewDto[];
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
          onClick={() => handleChangePetView(pet.pet_id)}
        >
          <img
            src={pet.pet_image}
            alt={pet.pet_name}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      ))}
      <div className="flex flex-col items-center justify-center">
        <button
          className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded-full"
          onClick={handleOpenCreateNewPet}
        >
          <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TabPets;
