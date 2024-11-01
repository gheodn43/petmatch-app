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
            }
        };
        
        const petResponse = await dynamoDB.send(new QueryCommand(getPetParams));
        const petData = petResponse.Items?.[0];
        
        if (!petData) {
            return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
        }

        // Xử lý danh sách đánh giá
        const petReview = petData.pet_review?.L?.map(review => {
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
        }).filter((review): review is Reviewing => review !== null) || [];

        // Tính tổng rating và số lượng đánh giá
        const totalRating = petReview.reduce((acc, review) => acc + review.rating, 0);
        const numberOfReviews = petReview.length;

        // Tính giá trị trung bình
        const averageRating = numberOfReviews > 0 ? totalRating / numberOfReviews : 0;

        // Sử dụng NextResponse.json để trả về kết quả cho client
        return NextResponse.json(
            new RcmPetDto({
                user_id: petData.user_id.S ?? '',
                pet_id: petData.pet_id.S ?? '',
                pet_type: petData.pet_type.S ?? '',
                pet_species: petData.pet_species.S ?? '',
                pet_name: petData.pet_name.S ?? '',
                pet_age: petData.pet_age.S ?? '',
                pet_birth_count: petData.pet_birth_count.S ?? '',
                pet_gender: petData.pet_gender.S ?? '',
                pet_pricing: petData.pet_pricing.S ?? '',
                pet_images: petData.pet_images?.L?.map(image => image.S ?? '') || [],
                pet_certificates: petData.pet_certificates?.L?.map(cert => cert.S ?? '') || [],
                pet_status: petData.pet_status.S ?? '',
                pet_star: averageRating, // Cập nhật pet_star với giá trị trung bình
                pet_review: petReview,
                viewed: false
            })
        );
    } catch (error) {
        console.error("Error fetching pet data:", error); // Ghi log lỗi
        return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 });
    }
}
