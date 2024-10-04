import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { RcmPetDto } from '@/app/model/pet';
import { Reviewing } from '@/app/model/review';

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { petId: string } }) {
    const { petId } = params;

    try {
        const getPetParams = {
            TableName: 'petmatch-pets',
            IndexName: 'pet_id-index',
            KeyConditionExpression: 'pet_id = :petId',
            ExpressionAttributeValues: {
                ':petId': { S: petId }
            },
            ProjectionExpression: 'pet_liked, pet_unliked, pet_type, pet_gender'
        };

        const petResponse = await dynamoDB.send(new QueryCommand(getPetParams));
        const petData = petResponse.Items?.[0];

        if (!petData) {
            return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
        }

        const likedPets = petData.pet_liked?.L ? petData.pet_liked.L.map(item => item.S) : [];
        const unlikedPets = petData.pet_unliked?.L ? petData.pet_unliked.L.map(item => item.S) : [];

        const petType = petData.pet_type.S;
        const petGender = petData.pet_gender.S;

        if (!petType || !petGender) {
            return NextResponse.json({ message: 'Pet type or gender missing' }, { status: 400 });
        }
        const partnerGender = petGender === 'Male' ? 'Female' : 'Male';
        const getRecommendedParams = {
            TableName: 'petmatch-pets',
            IndexName: 'pet_type-gender-index',
            KeyConditionExpression: 'pet_type = :petType and pet_gender = :petGender',
            ExpressionAttributeValues: {
                ':petType': { S: petType },
                ':petGender': { S: partnerGender },
            },
            Limit: 10,
        };

        const recommendedPetsResponse = await dynamoDB.send(new QueryCommand(getRecommendedParams));
        const recommendedPets = recommendedPetsResponse.Items || [];
        const filteredPets = recommendedPets.filter((pet: any) => {
            const petId = pet.pet_id.S;
            return !likedPets.includes(petId) && !unlikedPets.includes(petId);
        });

        const pets = filteredPets.map((item) => {
            const petImages = item.pet_images?.L?.map(image => image.S ?? '') || [];
            const petCertificates = item.pet_certificates?.L?.map(cert => cert.S ?? '') || [];
            const petReview = item.pet_review?.L?.map(review => {
                if (review.M) {
                    return {
                        user_id: review.M.user_id?.S ?? '',
                        user_name: review.M.user_name?.S ?? '',
                        user_avatar: review.M.user_avatar?.S ?? '',
                        rating: review.M.rating?.N ? Number(review.M.rating.N) : 0,
                        comment: review.M.comment?.S ?? ''
                    };
                }
                return null;
            })
            .filter((review): review is Reviewing => review !== null) || [];

            return new RcmPetDto({
                user_id: item.user_id.S ?? '',
                pet_id: item.pet_id.S ?? '',
                pet_type: item.pet_type.S ?? '',
                pet_species: item.pet_species.S ?? '',
                pet_name: item.pet_name.S ?? '',
                pet_age: item.pet_age.S ?? '',
                pet_birth_count: item.pet_birth_count.S ?? '',
                pet_gender: item.pet_gender.S ?? '',
                pet_pricing: item.pet_pricing.S ?? '',
                pet_images: petImages,
                pet_certificates: petCertificates,
                pet_status: item.pet_status.S ?? '',
                pet_star: item.pet_star?.N ? Number(item.pet_star.N) : 0,
                pet_review: petReview,
                viewed: false
            });
        });
        return NextResponse.json({ rcmPets: pets }, { status: 200 });
    } catch (error) {
        console.error('Error in getRcms handler:', error);
        return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

