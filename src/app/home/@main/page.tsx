'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TabPets from '@/components/pet/tabpets';
import { Button } from "@headlessui/react";
import { PetOverviewDto } from '@/app/model/pet';
import { dbPet } from '@/localDB/pet.db'; // Import Dexie database instance

export default function MainSection() {
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
    <div className=''>
      <TabPets pets={pets} />
      {error ? (
        <p>{error}</p>
      ) : isNotFound ? (
        <div className="bg-white absolute top-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-[800px] h-[600px]">
        <div className="flex flex-col w-2/3">
          <span className="font-sans font-black text-[70px] text-[#FFC629] uppercase">
            ghép đôi
          </span>
          <span className="font-sans font-black text-2xl text-[#666666] uppercase flex justify-end ">
            THÚ CƯNG CỦA BẠN NGAY.
          </span>
        </div>
        <div className="absolute top-1/2 -left-[10%]">
          <Link href="/membership-pkgs">
            <Button className="rounded-[25px] font-black font-sans w-60 h-16 bg-gradient-to-br from-[#FFC300] via-[#FEDF79] to-[#FFB800] text-white mt-10 ml-10 uppercase">
            View all package
            </Button>
          </Link>
        </div>
        <div className="bg-[#FEDF79] bg-opacity-20 p-8 rounded-tl-[300px] rounded-tr-[80px] rounded-br-[290px] rounded-bl-[170px] w-[680px] h-[500px] absolute top-20 left-[20%]">
          <img src="/images/bg-no-pet.png" alt="thumb" />
        </div>
      </div>
    </div>
      ) : pets.length > 0 ? (
        <div>We will show other pet cards here</div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
