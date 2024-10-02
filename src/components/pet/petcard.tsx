'use client'
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import axios from 'axios';
import { dbPet } from '@/localDB/pet.db';
import PetCardRender from './PetCardRender';
import PetCardSkeleton from "@/components/skeletonLoading/petcardSkeleton";
import { RcmPetDto } from '@/app/model/pet';

const PetCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pets, setPets] = useState<RcmPetDto[]>([]);
  const [isChangedLDB, setIsChangedLDB] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoRcms, setIsNoRcms] = useState(false);
  const selectedPets = useLiveQuery(() => dbPet.selected.toArray(), []);
  const firstSelectedPet = selectedPets?.[0];
  const rcms = useLiveQuery<RcmPetDto[]>(() => 
    firstSelectedPet
      ? dbPet.rcm
          .where({ pet_id: firstSelectedPet.pet_id })
          .first()
          .then(record => {
            const recommendedPets = record?.recommended_pets ?? [];
            return recommendedPets.filter(pet => !pet.viewed);
          })
      : Promise.resolve([]),
    [firstSelectedPet, isChangedLDB]
);

  

  useEffect(() => {
    const fetchRcm = async () => {
      if (firstSelectedPet) {
        const petId = firstSelectedPet.pet_id;
        const existingRecord = await dbPet.rcm.where('pet_id').equals(petId).first();
        if (existingRecord) {
          setIsLoading(false); // Dữ liệu có sẵn, ngừng loading
          return;
        }

        try {
          const response = await axios.get(`/api/pet/getRcms/${petId}`);
          const rcmPets = response.data.rcmPets;
          if (!rcmPets || rcmPets.length === 0) {
            setIsNoRcms(true);
            setPets([]);
            return;
          } else {
            await dbPet.rcm.add({ pet_id: petId, recommended_pets: rcmPets });
          }
        } catch (error) {
          console.error('Error fetching recommended pets:', error);
        } finally {
          setIsLoading(false); // Ngừng loading sau khi dữ liệu đã tải hoặc có lỗi
        }
      } else {
        setIsLoading(false); // Ngừng loading nếu không có thú cưng nào được chọn
      }
    };
    setPets([]);
    fetchRcm();
  }, [firstSelectedPet]);

  useEffect(() => {
    if (rcms && rcms.length > 0) {
      setPets(rcms);
    }
    console.log('called')
  }, [rcms]);

  const handleNextPet = () => {
    if (currentIndex === pets.length - 1) {
      setIsNoRcms(true);
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };
  

  const handleLike = async () => {
    const currentPet = pets[currentIndex];

    try {
      // await axios.post('/api/pet/like', { pet_id: currentPet.pet_id });
      if(firstSelectedPet){
        const existingRecord = await dbPet.rcm.where('pet_id').equals(firstSelectedPet.pet_id).first();
        if (existingRecord) {
          const updatedRecommendedPets = existingRecord.recommended_pets.map(pet => 
            pet.pet_id === currentPet.pet_id ? { ...pet, viewed: true } : pet
          );
          await dbPet.rcm.update(existingRecord.pet_id, { recommended_pets: updatedRecommendedPets });
          setIsChangedLDB(prev => !prev);
          handleNextPet(); // Chuyển sang pet tiếp theo
        }
      }

    } catch (error) {
      console.error('Error liking pet:', error);
    }
  };

  const handleDislike = async () => {
    const currentPet = pets[currentIndex];
    try {
      // await axios.post('/api/pet/dislike', { pet_id: currentPet.pet_id });
      if(firstSelectedPet){
        const existingRecord = await dbPet.rcm.where('pet_id').equals(firstSelectedPet.pet_id).first();
        if (existingRecord) {
          const updatedRecommendedPets = existingRecord.recommended_pets.map(pet => 
            pet.pet_id === currentPet.pet_id ? { ...pet, viewed: true } : pet
          );
          await dbPet.rcm.update(existingRecord.pet_id, { recommended_pets: updatedRecommendedPets });
        }
      }
      handleNextPet();
    } catch (error) {
      console.error('Error disliking pet:', error);
    }
  };

  const currentPet = pets[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center text-black h-full md:py-16">
      {pets.length > 0 ? (
        <PetCardRender
          currentPet={currentPet}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ) : isNoRcms ? ( 
        <img src="/images/not-found-rcms.svg" alt="Not found svg" className="h-[200px] md:h-[300px]" />
      ) : (
        <PetCardSkeleton />
      )}
    </div>
  );  
};

export default PetCard;
