import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getUserIdFromCookie } from '@/utils/authUtils';
import { MatchedItem } from '@/app/model/petMatchedItem';
import { pusherServer } from '@/lib/pusher';

const dynamoDB = new DynamoDBClient({});

let petBAvatar = '';
let petBOwnerId = '';
let petBName = '';

interface PetItem {
    pet_liked?: { L: { S: string }[] };
    pet_images?: { L: { S: string }[] };
    pet_name?: { S: string };
    user_id?: { S: string };
}

async function checkIfAlreadyLiked(petAId: string, petBId: string) {
    const params = {
        TableName: 'petmatch-pets',
        IndexName: 'pet_id-index',
        KeyConditionExpression: 'pet_id = :petBId',
        ExpressionAttributeValues: {
            ':petBId': { S: petBId }
        },
        ProjectionExpression: 'pet_liked, pet_images, pet_name, user_id'
    };

    try {
        const data = await dynamoDB.send(new QueryCommand(params));
        if (data.Items && data.Items.length > 0) {
            const item: PetItem = data.Items[0] as PetItem;
            const petLiked = item?.pet_liked?.L?.map((likedItem) => likedItem.S) ?? [];
            
            if (item?.pet_images?.L && item.pet_images.L.length > 0) {
                petBAvatar = item.pet_images.L[0].S ?? '';
            }
            petBOwnerId = item?.user_id?.S ?? '';
            petBName = item?.pet_name?.S ?? '';
            return petLiked.includes(petAId);
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error in checkIfAlreadyLiked:', error);
        throw error;
    }
}


async function saveLike(petAId: string, petBId: string, petAOwnerId: string) {
    const params = {
        TableName: 'petmatch-pets',
        Key: {
            user_id: { S: petAOwnerId },
            pet_id: { S: petAId }
        },
        UpdateExpression: 'SET pet_liked = list_append(if_not_exists(pet_liked, :empty_list), :new_like)',
        ExpressionAttributeValues: {
            ':new_like': { L: [{ S: petBId }] },
            ':empty_list': { L: [] }
        }
    };

    try {
        await dynamoDB.send(new UpdateItemCommand(params));
        console.log('Like saved successfully for petA:', petAId, 'with userId:', petAOwnerId);
    } catch (error) {
        console.error('Error in saveLike:', error);
        throw error;
    }
}

async function createChatRoom(petAId: string, petAAavatar: string, petAName: string, ownerAId: string, petBId: string) {
    const roomId = `${petAId}_${petBId}_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const lastMessageAt = createdAt; 

    const params = {
        TableName: 'petmatch-chat-room',
        Item: {
            room_id: { S: roomId },
            petA_id: { S: petAId },
            petA_name: { S: petAName },
            ownerA_id: { S: ownerAId },
            petB_id: { S: petBId },
            ownerB_id: { S: petBOwnerId },
            petB_name: { S: petBName },
            created_at: { S: createdAt },
            last_message_at: { S: lastMessageAt },
            petA_avatar: { S: petAAavatar },
            petB_avatar: { S: petBAvatar }
        }
    };

    try {
        await dynamoDB.send(new PutItemCommand(params));
        return roomId;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw new Error('Could not create chat room');
    }
}

async function notifyPetB(roomId: string, petAId: string, petAAavatar: string, petAName: string, petBId: string) {
    const matchedItem = new MatchedItem({
        room_id: roomId,
        pet_id: petBId,
        partner_id: petAId, // Pet A
        partner_avatar: petAAavatar,
        partner_name: petAName,
        created_at: new Date().toISOString(),
    });

    try {
        await pusherServer.trigger(`private-pet-${petBId}`, 'matched', matchedItem);
    } catch (error) {
        console.error('Error sending notification via Pusher:', error);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { petAId, petBId, pet_name, pet_image } = await req.json();
    try {
        const userIdOrResponse = await getUserIdFromCookie(req);
        if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
        const ownerAId = userIdOrResponse;
        const petAAavatar = pet_image;
        const petAName = pet_name;
        const isMatched = await checkIfAlreadyLiked(petAId, petBId);
        if (isMatched) {
            await saveLike(petAId, petBId, ownerAId);
            const roomId = await createChatRoom(petAId, petAAavatar, petAName, ownerAId, petBId);
            await notifyPetB(roomId, petAId, petAAavatar, petAName, petBId);
            const matchedItem = new MatchedItem({
                room_id: roomId,
                pet_id:petAId,
                partner_id: petBId,
                partner_avatar: petBAvatar,
                partner_name: petBName,
                created_at: new Date().toISOString(),
            });
            return NextResponse.json({ message: 'Match thành công, phòng chat đã được mở!', matchedItem });
        } else {
            await saveLike(petAId, petBId, ownerAId);
            return NextResponse.json({ message: 'pet A đã like pet B, chờ pet B like lại để match.' });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 });
    }
}