import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { MatchedItem } from '@/app/model/petMatchedItem';
import { ConversationItem } from '@/app/model/petConversationItem';
import { decodedToken } from '@/utils/decodeToken';

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { petId: string } }) {
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
        const conversation: Array<ConversationItem> = [];
        const processedRoomIds = new Set<string>();

        // Helper function to query last message by room_id
        const fetchLastMessage = async (roomId: string) => {
            const messageParams = {
                TableName: 'petmatch-messages',
                IndexName: 'GSI_RoomId_CreatedAt', // Tên GSI mới cần được tạo
                KeyConditionExpression: 'room_id = :room_id',
                ExpressionAttributeValues: {
                    ':room_id': { S: roomId }
                },
                // Sắp xếp giảm dần theo createdAt để lấy tin nhắn mới nhất
                ScanIndexForward: false, // Sắp xếp giảm dần
                Limit: 1 // Chỉ lấy 1 tin nhắn gần nhất
            };

            const messageData = await dynamoDB.send(new QueryCommand(messageParams));
            if (messageData.Items && messageData.Items.length > 0) {
                const lastMessage = messageData.Items[0];
                return {
                    sender_id: lastMessage.senderId.S!,
                    content: lastMessage.content.S!,
                    sent_at: lastMessage.createdAt.S!
                };
            }
            return {
                sender_id: '',
                content: '',
                sent_at: ''
            };
        };

        if (dataA.Items) {
            for (const item of dataA.Items) {
                const roomId = item.room_id.S!;
                if (!processedRoomIds.has(roomId)) {
                    if (item.start_chating) { // conversation
                        const lastMessage = await fetchLastMessage(roomId);
                        conversation.push({
                            room_id: roomId,
                            pet_id: petId,
                            owner_partner_id: item.ownerB_id.S!, 
                            partner_id: item.petB_id.S!,
                            partner_avatar: item.petB_avatar.S!,
                            partner_name: item.petB_name.S!,
                            last_message: {
                                sender_id: lastMessage.sender_id,
                                content: lastMessage.content
                            },
                            sent_at: lastMessage.sent_at
                        });
                    } else { // new matching
                        matched.push({
                            room_id: roomId,
                            pet_id: petId,
                            owner_partner_id: item.ownerB_id.S!,
                            partner_id: item.petB_id.S!, 
                            partner_avatar: item.petB_avatar.S!,
                            partner_name: item.petB_name.S!,
                            created_at: item.created_at.S!
                        });
                    }
                    processedRoomIds.add(roomId);
                }
            }
        }

        if (dataB.Items) {
            for (const item of dataB.Items) {
                const roomId = item.room_id.S!;
                if (!processedRoomIds.has(roomId)) {  
                    if (item.start_chating) { // conversation
                        const lastMessage = await fetchLastMessage(roomId);
                        conversation.push({
                            room_id: roomId,
                            pet_id: petId,
                            owner_partner_id: item.ownerA_id.S!,
                            partner_id: item.petA_id.S!,
                            partner_avatar: item.petA_avatar.S!,
                            partner_name: item.petA_name.S!,
                            last_message: {
                                sender_id: lastMessage.sender_id,
                                content: lastMessage.content
                            },
                            sent_at: lastMessage.sent_at
                        });
                    } else { // new match
                        matched.push({
                            room_id: roomId,
                            pet_id: petId,
                            owner_partner_id: item.ownerA_id.S!,
                            partner_id: item.petA_id.S!,
                            partner_avatar: item.petA_avatar.S!,
                            partner_name: item.petA_name.S!,
                            created_at: item.created_at.S!
                        });
                    }
                    processedRoomIds.add(roomId);
                }
            }
        }

        return NextResponse.json({ matched, conversation });
    } catch (error) {
        console.error('Error in getMyMatched handler:', error);
        return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 });
    }
}
