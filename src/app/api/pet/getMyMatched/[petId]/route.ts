import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { MatchedItem } from '@/app/model/petMatchedItem';
import { decodedToken } from '@/utils/decodeToken';

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { petId: string } }) {
    // const accessToken = req.cookies.get('access_token')?.value;
    // if (!accessToken) return NextResponse.json({ message: 'Access token is missing.' }, { status: 401 });
    // const userId = await decodedToken(accessToken);
    // if (!userId) return NextResponse.json({ message: 'Invalid Access Token' }, { status: 401 });
    const { petId } = params;
    try {
        const paramsA = {
            TableName: 'petmatch-chat-room',
            IndexName: 'GSI_PetA', 
            KeyConditionExpression: 'petA_id = :petId',
            ExpressionAttributeValues: {
                ':petId': { S: petId }
            },
        };
        const paramsB = {
            TableName: 'petmatch-chat-room',
            IndexName: 'GSI_PetB', 
            KeyConditionExpression: 'petB_id = :petId',
            ExpressionAttributeValues: {
                ':petId': { S: petId }
            },
        };

        const [dataA, dataB] = await Promise.all([
            dynamoDB.send(new QueryCommand(paramsA)),
            dynamoDB.send(new QueryCommand(paramsB))
        ]);

        const matched: Array<MatchedItem> = [];
        const processedRoomIds = new Set<string>(); 


        if (dataA.Items) {
            for (const item of dataA.Items) {
                const roomId = item.room_id.S!;
                if (!processedRoomIds.has(roomId)) {
                    matched.push({
                        room_id: roomId,
                        pet_id: petId,
                        partner_id: item.ownerB_id.S!, // Đảm bảo không phải undefined
                        partner_avatar: item.petB_avatar.S!,
                        partner_name: item.petB_name.S!,  // Đảm bảo không phải undefined
                        created_at: item.created_at.S! // Đảm bảo không phải undefined
                    });
                    processedRoomIds.add(roomId); // Đánh dấu room_id đã xử lý
                }
            }
        }


        if (dataB.Items) {
            for (const item of dataB.Items) {
                const roomId = item.room_id.S!;
                if (!processedRoomIds.has(roomId)) {
                    matched.push({
                        room_id: roomId,
                        pet_id: petId,
                        partner_id: item.ownerA_id.S!, // Đảm bảo không phải undefined
                        partner_avatar: item.petA_avatar.S!,
                        partner_name: item.petA_name.S!, // Đảm bảo không phải undefined
                        created_at: item.created_at.S! // Đảm bảo không phải undefined
                    });
                    processedRoomIds.add(roomId); // Đánh dấu room_id đã xử lý
                }
            }
        }

        return NextResponse.json({ matched });
    } catch (error) {
        console.error('Error in getMyMatched handler:', error);
        return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 });
    }
}
