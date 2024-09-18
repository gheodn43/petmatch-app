'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TabPets from '@/components/pet/tabpets';

type Pet = {
  pet_id: string;
  pet_name: string;
  pet_age: string;
  pet_type: string;
  pet_img1: string;
};

export default function MainSection() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false); // Thêm state để xử lý lỗi 404

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pet/getMyPets');
        if (response.ok) {
          const data = await response.json();
          setPets(data.pets);
        } else if (response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else if (response.status === 404) {
          setIsNotFound(true);
        } else if (response.status === 500) {
          setError('Internal server error. Please try again later.');
        } else {
          setError('An unexpected error occurred.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error. Please check your connection.');
      }
    };

    fetchPets();
  }, []);
  const samplePets = [{
    pet_id: '12345',
    pet_name: 'Max',
    pet_type: 'Dog',
    pet_species: 'Labrador',
    pet_image: 'images/logo-color.png',
    pet_gender: 'Male',
    pet_pricing: '500 USD',
    pet_status: 'active'
}];
  return (
    <div className=''>
      <TabPets pets={samplePets} /> 
      {error ? (
        <p>{error}</p>
      ) : isNotFound ? (
        <div className='flex justify-center items-center'>
          <div >
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
        <div>we will show other pet card in here</div>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}
