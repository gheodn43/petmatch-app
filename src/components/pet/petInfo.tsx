'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { RcmPetDto } from '@/app/model/pet';
import { useUser } from '@/providers/UserContext';

export default function PetInfo() {
    const searchParams = useSearchParams();
    const [petData, setPetData] = useState<RcmPetDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const { user_name, user_image, user_role } = useUser();

    useEffect(() => {
        const petId = searchParams.get('petId') as string;
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
    }, []);

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

    const handleSubmitReview = async () => {
        const petId = searchParams.get('petId') as string;
        if (!petId || !newComment.trim()) {
            setError('Please enter a valid comment');
            return;
        }

        try {
            const reviewData = {
                user_id: 'current_user_id',
                user_name: user_name,
                user_avatar: user_image,
                rating: newRating,
                comment: newComment,
                petOwner: petData.user_id,
            };

            //await axios.post(`/api/pet/${petId}/review`, reviewData);  //tạm thời chưa gọi api
            setPetData(prevData => prevData ? {
                ...prevData,
                pet_review: [
                    ...prevData.pet_review,
                    {
                        user_id: reviewData.user_id,
                        user_name: reviewData.user_name,
                        user_avatar: reviewData.user_avatar,
                        rating: reviewData.rating,
                        comment: reviewData.comment,
                    }
                ]
            } : prevData);

            setNewComment('');
            setNewRating(5);
            setError(null);
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Failed to submit review.');
        }
    };

    return (
        <div className='p-2'>
            <h1 className="text-2xl font-bold text-center text-secondary">{petData.pet_name}</h1>
            <div className="z-0">
                {petData.pet_images.length > 0 ? (
                    <div className="flex justify-center overflow-hidden">
                        <img
                            src={petData.pet_images[currentImageIndex]}
                            alt={`Pet image ${currentImageIndex + 1}`}
                            className="w-full md:w-1/3 lg:w-[350px] h-full md:h-[600px] object-cover rounded-md"
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
            <div className="mt-4 border-b">
                <div>{renderStars(petData.pet_star)} ({petData.pet_review.length > 0 ? petData.pet_review.length : 0})</div>
            </div>
            <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-400">Đánh giá gần đây</h3>
                {petData.pet_review.length > 0 ? (
                    petData.pet_review.map((review, index) => (
                        <div key={index} >
                            <div className="py-2 flex flex-row gap-2">
                                <div>
                                    <img src={review.user_avatar} className='rounded-full' style={{height: '45px'}}/>
                                </div>
                                <div>
                                    <p className='mb-0 text-gray-500'> <strong>{review.user_name}</strong></p>
                                    <div>{renderStars(review.rating)}</div>
                                </div>
                            </div>
                            <div className='px-3 text-gray-400'>
                                <p>{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-400'>Chưa có đánh giá nào cho {petData.pet_name}</p>
                )}
                <textarea
                    className="w-full border p-2 mt-2"
                    placeholder="Nhập đánh giá của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="flex items-center mt-2">
                    <label className="mr-2">Rating:</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="border p-1 w-16 text-center"
                    />
                </div>
                <button onClick={handleSubmitReview} className="mt-2 bg-secondary text-white p-2 rounded-lg">Gửi đánh giá</button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
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
