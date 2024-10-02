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
  const [isLoading, setIsLoading] = useState(true);
  const [isNoRcms, setIsNoRcms] = useState(false);
  const selectedPets = useLiveQuery(() => dbPet.selected.toArray(), []);
  const firstSelectedPet = selectedPets?.[0];
  const rcms = useLiveQuery<RcmPetDto[]>(
    () => firstSelectedPet
      ? dbPet.rcm
        .where({ pet_id: firstSelectedPet.pet_id })
        .first()
        .then(record => record?.recommended_pets ?? [])
      : Promise.resolve([]),
    [firstSelectedPet]
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
  }, [rcms]);

  const handleNextPet = () => {
    setCurrentIndex((prevIndex) => (prevIndex === pets.length - 1 ? 0 : prevIndex + 1));
  };

  const handleLike = async () => {
    const currentPet = pets[currentIndex];

    try {
      // await axios.post('/api/pet/like', { pet_id: currentPet.pet_id });
      handleNextPet(); // Chuyển sang pet tiếp theo
    } catch (error) {
      console.error('Error liking pet:', error);
    }
  };

  const handleDislike = async () => {
    const currentPet = pets[currentIndex];
    try {
      // await axios.post('/api/pet/dislike', { pet_id: currentPet.pet_id });
      handleNextPet(); // Chuyển sang pet tiếp theo
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
