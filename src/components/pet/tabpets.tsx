'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCrown } from '@fortawesome/free-solid-svg-icons';
import { PetOverviewDto } from '@/app/model/pet';
import { useUser } from '@/providers/UserContext'; 

type TabPetsProps = {
  pets: PetOverviewDto[];
};

const TabPets: React.FC<TabPetsProps> = ({ pets }) => {
  const { user_role } = useUser();
  const router = useRouter();

  const handleOpenCreateNewPet = () => {
    router.push('/pet/add-pet');
  };

  const handleChangePetView = (pet_id: string) => {
    console.log(`View details of pet with id: ${pet_id}`);
  };

  const handleOpenMembershipPkgs = () => {
    router.push('/membership-pkgs');
  };

  const isFreeUserAndMaxPetReached = user_role === 'free' && pets.length >= 1;
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
        {isFreeUserAndMaxPetReached ? (
          <button
            className="h-10 px-5 flex items-center justify-cente rounded-full bg-gradient-to-r from-secondary to-pink-500"
            onClick={handleOpenMembershipPkgs}
          >
            <FontAwesomeIcon icon={faCrown} className="text-white mr-2"/>
            <p className='text-white font-bold'>Upgrade</p>
          </button>
        ) : (
          <button
            className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded-full"
            onClick={handleOpenCreateNewPet}
          >
            <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TabPets;
