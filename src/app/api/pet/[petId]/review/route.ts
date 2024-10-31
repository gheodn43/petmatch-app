import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({});

export async function POST(req: NextRequest, { params }: { params: { petId: string } }) {
    const { petId } = params;
    const { user_id, user_name, user_avatar, rating, comment, petOwner } = await req.json();
    console.log(petOwner)

    if (!user_id || !rating) {
        return NextResponse.json({ message: 'user_id và rating là bắt buộc' }, { status: 400 });
    }

    try {
        const updateParams = {
            TableName: 'petmatch-pets',
            Key: {
                user_id: { S: petOwner }, // Partition key
                pet_id: { S: petId }      // Sort key
            },
            UpdateExpression: 'SET pet_review = list_append(if_not_exists(pet_review, :emptyList), :newReview)',
            ExpressionAttributeValues: {
                ':newReview': {
                    L: [
                        {
                            M: {
                                user_id: { S: user_id },
                                user_name: { S: user_name ?? '' },
                                user_avatar: { S: user_avatar ?? '' },
                                rating: { N: rating.toString() },
                                comment: { S: comment ?? '' },
                            },
                        },
                    ],
                },
                ':emptyList': { L: [] },
            }
        };
console.log(updateParams)
        try {
            const updateResponse = await dynamoDB.send(new UpdateItemCommand(updateParams));
            return NextResponse.json({
                message: 'Đánh giá đã được thêm thành công',
                updatedReview: updateResponse.Attributes?.pet_review,
            });
        } catch (error) {
            console.error("DynamoDB Error:", error);
            return NextResponse.json({ message: 'Có lỗi xảy ra khi thêm đánh giá'}, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Có lỗi xảy ra khi thêm đánh giá' }, { status: 500 });
    }
}
