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

// ======================================================================================= ĐỪNG XÓA PHẦN Ở TRÊN NHA =========================================================================================
//===========================================================================================================================================================================================================


'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faX } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import Draggable from 'react-draggable';
import petData from '@/components/pet/virtual_res_card.json'; // Dummy pet data

export default function PetCard() {
  const [currentIndex, setCurrentIndex] = useState(0); // Index của pet hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index của ảnh hiện tại của pet
  const [swipeLogs, setSwipeLogs] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef(null); // Ref để sử dụng với Draggable

  const [pets, setPets] = useState(petData.pets);
  const [animationClass, setAnimationClass] = useState<string>('');

  const handleSwipe = useCallback((direction: string) => {
    const log = direction === 'right' ? 'like' : 'dislike';
    setSwipeLogs((prevLogs) => [
      ...prevLogs,
      `${log} on ${pets[currentIndex].pet_name} with ID is ${pets[currentIndex].pet_id}`,
    ]);
    setCurrentIndex((prevIndex) =>
      prevIndex === pets.length - 1 ? 0 : prevIndex + 1
    );
    setCurrentImageIndex(0);
    setAnimationClass(direction === 'right' ? 'like-animation' : 'dislike-animation');
    setTimeout(() => {
      setAnimationClass(''); // Reset lại animation class sau 1s
    }, 1000);
  }, [currentIndex, pets]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const currentPet = pets[currentIndex];

  const onDragStop = (e: any, data: any) => {
    if (data.x > 150) {
      handleSwipe('right');
    } else if (data.x < -150) {
      handleSwipe('left');
    } else {
      resetCardPosition();
    }
  };

  const resetCardPosition = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease'; // Smooth transition back to center
      cardRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  // Handles image click to switch between images
  const handleImageClick = (event: React.MouseEvent) => {
    const { clientX } = event;
    const { left, right } = (event.target as HTMLDivElement).getBoundingClientRect();
    const clickPosition = clientX - left;
    const halfWidth = (right - left) / 2;

    if (clickPosition > halfWidth) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === currentPet.pet_images.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? currentPet.pet_images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="flex flex-col items-center text-black py-16">
      {currentPet ? (
        <Draggable nodeRef={nodeRef} onStop={onDragStop} position={{ x: 0, y: 0 }}>
          <div
            ref={nodeRef}
            className="relative w-[350px] h-[570px] shadow-lg bg-secondary rounded-2xl"
          >
            <div
              {...swipeHandlers}
              ref={cardRef}
              className={`rounded-2xl bg-white overflow-hidden ${animationClass}`}
            >
              {/* Image click to switch between images */}
              <div
                className="relative w-full h-[570px] object-cover cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={currentPet.pet_images?.[currentImageIndex] || 'default-image-url'}
                  alt={currentPet.pet_name || 'No Name'}
                  className="w-[350px] h-[570px] object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                {/* Pet Details Overlay */}
                <div className="absolute bottom-24 left-4 text-white">
                  <h3 className="text-xl font-bold">{currentPet.pet_name}</h3>
                  <div className="flex gap-1 mt-1">
                    <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-md text-xs">
                      {currentPet.pet_species}
                    </span>
                    <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-md text-xs">
                      {currentPet.pet_pricing} VNĐ
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>{currentPet.pet_review.length} reviews ({currentPet.pet_star}⭐)</p>
                  </div>
                </div>

                {/* Like / Dislike Buttons */}
                <div
                  className="absolute left-8 bottom-6 cursor-pointer"
                  onClick={() => {
                    handleSwipe('left');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faX}
                    className="text-red-500 bg-white p-4 rounded-full text-3xl shadow-lg hover:bg-gray-200 px-5"
                  />
                </div>
                <div
                  className="absolute right-8 bottom-6 cursor-pointer"
                  onClick={() => {
                    handleSwipe('right');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-yellow-400 bg-white p-4 rounded-full text-3xl shadow-lg hover:bg-gray-200"
                  />
                </div>
              </div>


            </div>
          </div>
        </Draggable>
      ) : (
        <p>No pets found.</p>
      )}
    </div>
  );
}
