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
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faX } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import Draggable from 'react-draggable';
import { Pet } from '@/app/model/pet';
import petData from '@/components/pet/virtual_res_card.json'; // Import file JSON

export default function PetCard() {
  const [currentIndex, setCurrentIndex] = useState(0); // Index của pet hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index của ảnh hiện tại của pet
  const [swipeLogs, setSwipeLogs] = useState<string[]>([]);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const [pets, setPets] = useState<Pet[]>(petData.pets);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [animationClass, setAnimationClass] = useState<string>('');
  const count = 5; // Số bản ghi mỗi lần load

  useEffect(() => {
    const loadMorePets = () => {
      setLoading(true);
      const newPets = pets.slice(startIndex, startIndex + count);
      setPets((prevPets) => [...prevPets, ...newPets]);
      setLoading(false);
      if (newPets.length < count) {
        setHasMore(false); // Không còn dữ liệu để load
      }
    };

    loadMorePets();
  }, [startIndex]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setStartIndex((prevIndex) => prevIndex + count);
    }
  };

  const handleSwipe = (direction: string) => {
    const log = direction === 'right' ? 'like' : 'dislike';
    setSwipeLogs((prevLogs) => [...prevLogs, `${log} on ${pets[currentIndex].pet_name} with ID is ${pets[currentIndex].pet_id}`]);
    setCurrentIndex((prevIndex) => (prevIndex === pets.length - 1 ? 0 : prevIndex + 1));
    setCurrentImageIndex(0);
    if (direction === 'right') {
      setAnimationClass('like-animation');
    } else {
      setAnimationClass('dislike-animation');
    }
    setTimeout(() => {
      setAnimationClass(''); // Reset lại animation class sau 1s
    }, 1000);
  };

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
      cardRef.current.style.transition = 'none';
      cardRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  // Xử lý chuyển đổi ảnh
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
    <div className="flex flex-col items-center text-black pt-11 ">
      {currentPet ? (
        <Draggable onStop={onDragStop} position={{ x: 0, y: 0 }}>
          <div className='relative w-[300px] h-[450px]  shadow-lg shadow-primary bg-secondary rounded-xl'>
            <div {...swipeHandlers} ref={cardRef} className={`rounded-xl bg-white overflow-hidden ${animationClass}`}>
              {/* Click vào nửa bên phải hoặc trái để chuyển ảnh */}
              <div
                className="relative w-full h-[350px] object-cover cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={currentPet.pet_images[currentImageIndex]}
                  alt={currentPet.pet_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold">{currentPet.pet_name}</h3>
                <p>Type: {currentPet.pet_type}</p>
                <p>Species: {currentPet.pet_species}</p>
                <p>Gender: {currentPet.pet_gender}</p>
                <p>Status: {currentPet.pet_status}</p>
              </div>

              {/* Like / Dislike */}
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  handleSwipe('left'); // Tương đương với swipe trái
                }}
              >
                <FontAwesomeIcon icon={faX} className="text-red-700 bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
              </div>
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/ cursor-pointer"
                onClick={() => {
                  handleSwipe('right'); // Tương đương với swipe phải
                }}
              >
                <FontAwesomeIcon icon={faHeart} className="text-yellow-500 bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
              </div>
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
              <li key={index} className="text-sm">{log}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
