import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { getUserIdFromCookie } from '@/utils/authUtils';
import { MatchedItem } from '@/app/model/petMatchedItem';

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest) {
    try {
        const userIdOrResponse = await getUserIdFromCookie(req);
        if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
        const userId = userIdOrResponse;

        // Truy vấn tất cả các phòng chat mà người dùng là ownerA hoặc ownerB
        const paramsA = {
            TableName: 'petmatch-chat-room',
            IndexName: 'GSI_OwnerA', // GSI với ownerA_id
            KeyConditionExpression: 'ownerA_id = :userId',
            ExpressionAttributeValues: {
                ':userId': { S: userId }
            },
        };

        const paramsB = {
            TableName: 'petmatch-chat-room',
            IndexName: 'GSI_OwnerB', // GSI với ownerB_id
            KeyConditionExpression: 'ownerB_id = :userId',
            ExpressionAttributeValues: {
                ':userId': { S: userId }
            },
        };

        const [dataA, dataB] = await Promise.all([
            dynamoDB.send(new QueryCommand(paramsA)),
            dynamoDB.send(new QueryCommand(paramsB))
        ]);

        const matched: Array<MatchedItem> = [];
        const processedRoomIds = new Set<string>(); // Set để lưu room_id đã xử lý

        // Xử lý dữ liệu từ ownerA
        if (dataA.Items) {
            for (const item of dataA.Items) {
                const roomId = item.room_id.S!;
                if (!processedRoomIds.has(roomId)) {
                    console.log('chua xu ly')
                    matched.push({
                        room_id: roomId,
                        partner_id: item.ownerB_id.S!, // Đảm bảo không phải undefined
                        partner_avatar: item.petB_avatar.S!,
                        partner_name: item.petB_name.S!,  // Đảm bảo không phải undefined
                        created_at: item.created_at.S! // Đảm bảo không phải undefined
                    });
                    processedRoomIds.add(roomId); // Đánh dấu room_id đã xử lý
                }
            }
        }

        // Xử lý dữ liệu từ ownerB
        if (dataB.Items) {
            for (const item of dataB.Items) {
                const roomId = item.room_id.S!;
                if (!processedRoomIds.has(roomId)) {
                    matched.push({
                        room_id: roomId,
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
