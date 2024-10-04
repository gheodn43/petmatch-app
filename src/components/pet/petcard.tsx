'use client'
import React, { useReducer, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import axios from 'axios';
import { dbPet } from '@/localDB/pet.db';
import PetCardRender from './PetCardRender';
import PetCardSkeleton from "@/components/skeletonLoading/petcardSkeleton";
import { RcmPetDto } from '@/app/model/pet';
import CTACreatePet from '../CTACreaatePet';
import { usePetsContext } from '@/providers/PetsContext';

const initialState = {
  currentIndex: 0,
  isChangedLDB: false,
  isLoading: true,
  isNoRcms: false
};

type State = typeof initialState;

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NO_RCMS'; payload: boolean }
  | { type: 'SET_CHANGED_LDB'; payload: boolean }
  | { type: 'NEXT_PET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_NO_RCMS':
      return { ...state, isNoRcms: action.payload };
    case 'SET_CHANGED_LDB':
      return { ...state, isChangedLDB: action.payload };
    case 'NEXT_PET':
      const nextIndex = state.currentIndex + 1;
      return { ...state, currentIndex: nextIndex };
    default:
      return state;
  }
}

const PetCard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentIndex, isLoading, isNoRcms } = state;

  const selectedPets = useLiveQuery(() => dbPet.selected.toArray(), []);
  const firstSelectedPet = selectedPets?.[0];

  const { hasPets } = usePetsContext();
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
    [firstSelectedPet, state.isChangedLDB]
  );

  const fetchNextRcm = async () => {
    if (!firstSelectedPet) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    const petId = firstSelectedPet.pet_id;
    try {
      const response = await axios.get(`/api/pet/getRcms/${petId}`);
      const rcmPets = response.data.rcmPets;
      if (!rcmPets || rcmPets.length === 0) {
        dispatch({ type: 'SET_NO_RCMS', payload: true });
        return;
      } else {
        await dbPet.rcm.update(petId,{ recommended_pets: rcmPets });
      }
    } catch (error) {
      console.error('Error fetching recommended pets:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }
  useEffect(() => {
    const fetchRcm = async () => {
      if (!firstSelectedPet) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const petId = firstSelectedPet.pet_id;
      const existingRecord = await dbPet.rcm.where('pet_id').equals(petId).first();
      if (existingRecord) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const response = await axios.get(`/api/pet/getRcms/${petId}`);
        const rcmPets = response.data.rcmPets;
        if (!rcmPets || rcmPets.length === 0) {
          dispatch({ type: 'SET_NO_RCMS', payload: true });
          return;
        } else {
          await dbPet.rcm.add({ pet_id: petId, recommended_pets: rcmPets });
        }
      } catch (error) {
        console.error('Error fetching recommended pets:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchRcm();
  }, [firstSelectedPet]);

  const handleNextPet = () => {
    if (currentIndex === (rcms?.length || 0) - 1) {
      fetchNextRcm();
      //dispatch({ type: 'SET_NO_RCMS', payload: true });
    } else {
      dispatch({ type: 'NEXT_PET' });
    }
  };

  const handleLike = async () => {
    const currentPet = rcms?.[currentIndex];

    try {
      if (firstSelectedPet && currentPet) {
        const existingRecord = await dbPet.rcm.where('pet_id').equals(firstSelectedPet.pet_id).first();
        if (existingRecord) {
          const updatedRecommendedPets = existingRecord.recommended_pets.map(pet =>
            pet.pet_id === currentPet.pet_id ? { ...pet, viewed: true } : pet
          );
          await dbPet.rcm.update(existingRecord.pet_id, { recommended_pets: updatedRecommendedPets });
          dispatch({ type: 'SET_CHANGED_LDB', payload: !state.isChangedLDB });
          handleNextPet();
        }
      }
    } catch (error) {
      console.error('Error liking pet:', error);
    }
  };

  const handleDislike = async () => {
    const currentPet = rcms?.[currentIndex];

    try {
      if (firstSelectedPet && currentPet) {
        const existingRecord = await dbPet.rcm.where('pet_id').equals(firstSelectedPet.pet_id).first();
        if (existingRecord) {
          const updatedRecommendedPets = existingRecord.recommended_pets.map(pet =>
            pet.pet_id === currentPet.pet_id ? { ...pet, viewed: true } : pet
          );
          await dbPet.rcm.update(existingRecord.pet_id, { recommended_pets: updatedRecommendedPets });
          handleNextPet();
        }
      }
    } catch (error) {
      console.error('Error disliking pet:', error);
    }
  };

  const currentPet = rcms?.[currentIndex];

  if (!hasPets) {
    return (
      <div className="flex flex-col items-center justify-center text-black h-full md:py-16">
        <CTACreatePet />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center text-black h-full md:py-16">
      {!firstSelectedPet ? (
        <PetCardSkeleton />
      ) : rcms?.length ? (
        currentPet ? (
          <PetCardRender currentPet={currentPet} onLike={handleLike} onDislike={handleDislike} />
        ) : (
          <PetCardSkeleton />
        )
      ) : isNoRcms ? (
        <img src="/images/not-found-rcms.svg" alt="Not found svg" className="h-[200px] md:h-[300px]" />
      ) : (
        <PetCardSkeleton />
      )}
    </div>
  );
};

export default PetCard;

