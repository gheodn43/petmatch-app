'use client';
import React, { useRef, useState, useEffect } from 'react';
import { RcmPetDto } from '@/app/model/pet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faX } from '@fortawesome/free-solid-svg-icons';

interface PetCardRenderProps {
  currentPet: RcmPetDto;
  onLike: () => void;
  onDislike: () => void;
}

const PetCardRender: React.FC<PetCardRenderProps> = ({ currentPet, onLike, onDislike }) => {
  const touchStartRef = useRef<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Trạng thái chỉ số ảnh hiện tại
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentPet]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextImage(); 
      } else if (event.key === 'ArrowLeft') {
        previousImage();
      }
    };
    console.log(currentImageIndex)
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Dọn dẹp listener
    };
  }, [currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === currentPet.pet_images.length - 1 ? 0 : prevIndex + 1)
  };
  
  const previousImage = () => {
      setCurrentImageIndex((prevIndex) => prevIndex === 0 ? currentPet.pet_images.length - 1 : prevIndex - 1);
  };
  

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX; // Lưu vị trí chạm ban đầu
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchDiff = touchEndX - (touchStartRef.current as number);

      if (touchDiff > 50) {
        onLike(); // Quẹt sang phải -> Like
      } else if (touchDiff < -50) {
        onDislike(); // Quẹt sang trái -> Dislike
      }
    }
    touchStartRef.current = null; // Reset vị trí chạm
  };

  return (
    <div
      className="relative w-full md:w-[350px] h-full md:h-auto shadow-lg bg-secondary md:rounded-2xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}    >
      <div className="bg-white overflow-hidden h-full md:h-auto md:rounded-2xl cursor-pointer">
        <div className="relative h-full" onClick={nextImage}>
          {currentPet ? (
            <img
              src={currentPet.pet_images[currentImageIndex] || 'default-image-url'}
              alt={currentPet.pet_name || 'No Name'}
              className="w-full lg:w-[350px] h-full md:h-[600px] object-cover"
            />
          ) : (
            <p>No pet information available.</p>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-24 left-4 text-white">
            <h3 className="text-xl font-bold">{currentPet?.pet_name || 'No Name'}</h3>
            <div className="flex gap-1 mt-1">
              <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-md text-xs">
                {currentPet?.pet_species}
              </span>
              <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-md text-xs">
                {currentPet?.pet_pricing} VNĐ
              </span>
            </div>
            <div className="mt-2 text-sm">
              <p>{currentPet?.pet_review.length} reviews ({currentPet?.pet_star}⭐)</p>
            </div>
          </div>
          <div className="absolute left-8 bottom-6 cursor-pointer" onClick={onDislike}>
            <FontAwesomeIcon icon={faX} className="text-red-500 bg-white py-4 px-5  rounded-full text-3xl shadow-lg hover:bg-gray-200" />
          </div>
          <div className="absolute right-8 bottom-6 cursor-pointer" onClick={onLike}>
            <FontAwesomeIcon icon={faHeart} className="text-yellow-400 bg-white p-4 rounded-full text-3xl shadow-lg hover:bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCardRender;
