'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { RcmPetDto } from '@/app/model/pet';

export default function PetInfo() {
    const searchParams = useSearchParams();
    const petId = searchParams.get('petId');
    const [petData, setPetData] = useState<RcmPetDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (petId) {
            axios.get<RcmPetDto>(`/api/pet/${petId}`)
                .then(response => {
                    setPetData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pet data:', error);
                    setError('Failed to load pet data.');
                });
        }
    }, [petId]);

    if (error) return <p>{error}</p>;
    if (!petData) return <p>Loading...</p>;

    const renderStars = (rating: number) => {
        const maxStars = 5;
        return Array.from({ length: maxStars }, (_, index) => (
            <span key={index} style={{ color: index < rating ? 'gold' : 'gray' }}>★</span>
        ));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % petData.pet_images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + petData.pet_images.length) % petData.pet_images.length);
    };

    return (
        <div className='text-black'>
            <h1 className="text-2xl font-bold">{petData.pet_name}</h1>

            {/* Carousel for pet images */}
            <div className="relative">
                {petData.pet_images.length > 0 ? (
                    <div className="overflow-hidden">
                        <img 
                            src={petData.pet_images[currentImageIndex]} 
                            alt={`Pet image ${currentImageIndex + 1}`} 
                            className="w-full h-auto"
                        />
                    </div>
                ) : (
                    <p>No images available</p>
                )}
                {petData.pet_images.length > 1 && (
                    <>
                        <button onClick={handlePrevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2">
                            &#10094;
                        </button>
                        <button onClick={handleNextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2">
                            &#10095;
                        </button>
                    </>
                )}
            </div>

            {/* Rating */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Rating</h3>
                <div>{renderStars(petData.pet_star)}</div>
            </div>

            {/* Pet Reviews */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Reviews</h3>
                {petData.pet_review.length > 0 ? (
                    petData.pet_review.map((review, index) => (
                        <div key={index} className="border-b py-2">
                            <p><strong>{review.user_name}</strong>: {review.comment}</p>
                            <div>{renderStars(review.rating)}</div>
                        </div>
                    ))
                ) : (
                    <div>
                        <p>Chưa có đánh giá nào</p>
                        <textarea className="w-full border p-2 mt-2" placeholder="Nhập đánh giá của bạn..."></textarea>
                        <button className="mt-2 bg-blue-500 text-white p-2">Gửi đánh giá</button>
                    </div>
                )}
            </div>

            {/* Pet Certificates */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Certificates</h3>
                {petData.pet_certificates.length > 0 ? (
                    petData.pet_certificates.map((cert, index) => (
                        <div key={index} className="py-2">
                            <a href={cert} download className="text-blue-600 underline">{`Certificate ${index + 1}`}</a>
                        </div>
                    ))
                ) : (
                    <p>No certificates available</p>
                )}
            </div>
        </div>
    );
}
