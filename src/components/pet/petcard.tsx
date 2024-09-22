// 'use client';
// import React from 'react';
// //import { PetOverviewDto } from '@/app/model/pet';
// import { dbPet } from '@/localDB/pet.db';
// import { useLiveQuery } from 'dexie-react-hooks';

// export default function PetCard() {
//   // Lấy dữ liệu từ Dexie
//   const selectedPets = useLiveQuery(() => dbPet.selected.toArray(),[]);
//   if (!selectedPets) {
//     return <p>Loading...</p>;
//   }
//   const firstPet = selectedPets.length > 0 ? selectedPets[0] : null;

//   return (
//     <div className="flex flex-col items-center text-black pt-11">
//       {firstPet ? (
//         <div className="pet-card">
//           <img src={firstPet.pet_image} alt={firstPet.pet_name} className="pet-image w-[200px]" />
//           <h3>{firstPet.pet_name}</h3>
//           <p>Type: {firstPet.pet_type}</p>
//           <p>Species: {firstPet.pet_species}</p>
//           <p>Gender: {firstPet.pet_gender}</p>
//           <p>Status: {firstPet.pet_status}</p>
//         </div>
//       ) : (
//         <p>No selected pets found.</p>
//       )}
//     </div>
//   );
// }



'use client';
import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import Draggable from 'react-draggable'; // Import D
// Dummy pet data stored locally
const dummyPets = [
  {
    pet_id: '1',
    pet_image: 'https://placekitten.com/300/400',
    pet_name: '1',
    pet_type: 'Cat',
    pet_species: 'Persian',
    pet_gender: 'Male',
    pet_status: 'Available',
  },
  {
    pet_id: '2',
    pet_image: 'https://placekitten.com/301/401',
    pet_name: '2',
    pet_type: 'Dog',
    pet_species: 'Golden Retriever',
    pet_gender: 'Female',
    pet_status: 'Available',
  },
  {
    pet_id: '3',
    pet_image: 'https://placekitten.com/302/402',
    pet_name: '3',
    pet_type: 'Dog',
    pet_species: 'Husky',
    pet_gender: 'Male',
    pet_status: 'Unavailable',
  },
  {
    pet_id: '4',
    pet_image: 'https://placekitten.com/303/403',
    pet_name: '4',
    pet_type: 'Cat',
    pet_species: 'Siamese',
    pet_gender: 'Female',
    pet_status: 'Available',
  },
  {
    pet_id: '5',
    pet_image: 'https://placekitten.com/304/404',
    pet_name: '5',
    pet_type: 'Dog',
    pet_species: 'Chihuahua',
    pet_gender: 'Male',
    pet_status: 'Adopted',
  },
];

export default function PetCard() {
  const [currentIndex, setCurrentIndex] = useState(0); // Keep track of the current pet being shown
  const [swipeLogs, setSwipeLogs] = useState<string[]>([]); // Logs to keep track of swipes
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: string) => {
    // Log the swipe direction as "like" or "dislike"
    const log = direction === 'right' ? 'like' : 'dislike';
    setSwipeLogs((prevLogs) => [...prevLogs, `${log} on ${dummyPets[currentIndex].pet_name}`]);

    // Move to the next pet after swipe
    setCurrentIndex((prevIndex) => (prevIndex === dummyPets.length - 1 ? 0 : prevIndex + 1));
  };

  // Swipeable hook for detecting swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackMouse: true, // This allows mouse swiping as well as touch events
  });

  const currentPet = dummyPets[currentIndex]; // Get the current pet to display

  const onDragStop = (e: any, data: any) => {
    // Detect the horizontal position (x-axis) to decide like or dislike
    if (data.x > 150) {
      handleSwipe('right');
    } else if (data.x < -150) {
      handleSwipe('left');
    } else {
      // Reset position if it's a small drag
      resetCardPosition();
    }
  };

  const resetCardPosition = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'none'; // Remove animation for reset
      cardRef.current.style.transform = 'translate(0px, 0px)'; // Reset position
    }
  };

  return (
    <div className="flex flex-col items-center text-black pt-11">
      {currentPet ? (
        <Draggable
          onStop={onDragStop} // Handle drag stop to detect swipe direction
          position={{ x: 0, y: 0 }}
        >
          <div
            {...swipeHandlers} // Adding swipe handlers to the pet card container
            ref={cardRef} // Attach the ref to the card div
            className="pet-card relative w-[300px] h-[450px] bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Display the pet image */}
            <img
              src={currentPet.pet_image}
              alt={currentPet.pet_name}
              className="w-full h-[350px] object-cover"
            />
            <div className="p-4">
              {/* Display pet details */}
              <h3 className="text-xl font-bold">{currentPet.pet_name}</h3>
              <p>Type: {currentPet.pet_type}</p>
              <p>Species: {currentPet.pet_species}</p>
              <p>Gender: {currentPet.pet_gender}</p>
              <p>Status: {currentPet.pet_status}</p>
            </div>
          </div>
        </Draggable>
      ) : (
        <p>No pets found.</p>
      )}

      {/* Swipe logs */}
      <div className="mt-4 w-[300px] bg-gray-100 p-4 rounded-lg shadow-md">
        <h4 className="font-bold mb-2">Swipe Logs</h4>
        {swipeLogs.length === 0 ? (
          <p>No swipes yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {swipeLogs.map((log, index) => (
              <li key={index} className="text-sm">
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}