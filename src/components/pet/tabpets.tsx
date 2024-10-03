'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCrown } from '@fortawesome/free-solid-svg-icons';
import { PetOverviewDto } from '@/app/model/pet';
import { useUser } from '@/providers/UserContext'; 
import { dbPet } from '@/localDB/pet.db';
import { useHomeContext } from '@/providers/HomeContext';

type TabPetsProps = {
  pets: PetOverviewDto[];
};

const TabPets: React.FC<TabPetsProps> = ({ pets }) => {
  const { user_role } = useUser();
  const router = useRouter();
  const [selectedPets, setSelectedPets] = React.useState<PetOverviewDto[]>([]);
  const {setHomeActiveView } = useHomeContext();

  useEffect(() => {
    const fetchSelectedPets = async () => {
      const selected = await dbPet.selected.toArray();
      setSelectedPets(selected);
      if (selected.length === 0 && pets.length > 0) {
        await handleSelectPet(pets[0]);
      }
    };
    fetchSelectedPets();
  }, [pets]);

  const handleOpenCreateNewPet = () => {
    setHomeActiveView('main');
    router.push('/pet/add-pet');
  };

  const handleSelectPet = async (pet: PetOverviewDto) => {
    if (selectedPets.length > 0) {
      await dbPet.selected.delete(selectedPets[0].pet_id);
    }
    await dbPet.selected.add({ ...pet, pet_status: 'active' });
    setSelectedPets([pet]);
  };
  const handleOpenMembershipPkgs = () => {
    router.push('/membership-pkgs');
  };
  const isFreeUserAndMaxPetReached = user_role === 'free' && pets.length >= 1;
  return (
    <div className="flex items-center space-x-2 h-16 p-4 border-b-2 border-solid border-tertiary bg-secondary md:bg-white">
      {pets.map((pet) => {
        const isSelected = selectedPets.some(selectedPet => selectedPet.pet_id === pet.pet_id);
        return (
          <div
            key={pet.pet_id}
            className={`flex flex-col items-center cursor-pointer ${isSelected ? 'border-4 rounded-full border-primary md:border-yellow-500' : ''}`}
            onClick={() => handleSelectPet(pet)}
          >
            <img
              src={pet.pet_image}
              alt={pet.pet_name}
              className={`h-10 w-10 rounded-full object-cover`}
            />
          </div>
        );
      })}
      <div className="flex flex-col items-center justify-center">
        {isFreeUserAndMaxPetReached ? (
          <button
            className="h-10 px-5 flex items-center justify-center rounded-full bg-gradient-to-r from-secondary to-pink-500"
            onClick={handleOpenMembershipPkgs}
          >
            <FontAwesomeIcon icon={faCrown} className="text-white mr-2" />
            <p className="text-white font-bold">Upgrade</p>
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
