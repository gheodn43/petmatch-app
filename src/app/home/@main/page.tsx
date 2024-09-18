'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TabPets from '@/components/pet/tabpets';
import { PetOverviewDto } from '@/app/model/pet';
import { dbPet, addSamplePetsToDb} from '@/localDB/pet.db'; // Import Dexie database instance

export default function MainSection() {
  const [pets, setPets] = useState<PetOverviewDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchPets = async () => {
      //await addSamplePetsToDb();
      try {
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
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error. Please check your connection.');
      }
    };

    fetchPets();
  }, []);

  return (
    <div className=''>
      <TabPets pets={pets} /> 
      {error ? (
        <p>{error}</p>
      ) : isNotFound ? (
        <div className='flex justify-center items-center'>
          <div>
            <img
              src="/images/bg-no-pet.png"
              alt="No pets found"
              className="opacity-35 w-[250px] sm:w-[450px] md:w-[550px] lg:w-[650px]"
            />
          </div>
          <Link href="/membership-pkgs">
            <button className="mt-4 p-2 bg-blue-500 text-white rounded">
              View all package
            </button>
          </Link>
        </div>
      ) : pets.length > 0 ? (
        <div>We will show other pet cards here</div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
