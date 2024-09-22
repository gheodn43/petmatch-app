// layout.tsx
'use client';
import React, { useEffect, useState } from 'react';
import TabPets from '@/components/pet/tabpets';
import { PetOverviewDto } from '@/app/model/pet';
import { dbPet } from '@/localDB/pet.db';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<PetOverviewDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchPets = async () => {
      const localPets = await dbPet.pet.toArray();
      if (localPets.length > 0) {
        setPets(localPets);
      } else {
        const response = await fetch('/api/pet/getMyPets');
        if (response.ok) {
          const data = await response.json();
          setPets(data.pets);
          await dbPet.pet.bulkAdd(data.pets);
        } else if (response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else if (response.status === 404) {
          setIsNotFound(true);
        } else if (response.status === 500) {
          setError('Internal server error. Please try again later.');
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };
    fetchPets();
  }, []);

  return (
    <div>
      <TabPets pets={pets} />
      {children}
    </div>
  );
}
