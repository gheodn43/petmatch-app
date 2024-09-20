import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getUserIdFromCookie } from '@/utils/authUtils';
import { MatchedItem } from '@/app/model/petMatchedItem';

const dynamoDB = new DynamoDBClient({});

let petBAvatar = '';
let petBOwnerId = '';
let petBName = '';

async function checkIfAlreadyLiked(petAId: string, petBId: string) {
    console.log('Checking if petA has already liked petB...');
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
        console.log('Query result:', data);

        if (data.Items && data.Items.length > 0) {
            const item = data.Items[0]; 
            const petLiked = item?.pet_liked?.L ? item.pet_liked.L.map((item: any) => item.S) : [];
            
            if (item?.pet_images?.L && item.pet_images.L.length > 0) {
                petBAvatar = item.pet_images.L[0].S ?? '';
            }
            petBOwnerId = item?.user_id?.S ?? '';
            petBName = item?.pet_name?.S ?? '';
            console.log('PetB Avatar:', petBAvatar,'PetB name:', petBName, 'PetB Owner ID:', petBOwnerId);
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
    console.log('Saving like for petA:', petAId, 'petB:', petBId, 'userId:', petAOwnerId);

    const params = {
        TableName: 'petmatch-pets',
        Key: {
            user_id: { S: petAOwnerId },  // Partition key
            pet_id: { S: petAId }    // Sort key
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
        console.log(`Chat room created successfully for pets: ${roomId}`);
        return roomId;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw new Error('Could not create chat room');
    }
}

async function enableChatForpets(petAId: string, petBId: string, roomId: string) {
    console.log(`Chat enabled for pets ${petAId} and ${petBId} in room ${roomId}`);
}

export async function POST(req: NextRequest, { params }: { params: { petAId: string, petBId: string } }) {
    const { petAId, petBId } = params;
    console.log('Starting POST request:', petAId, petBId);

    try {
        const userIdOrResponse = await getUserIdFromCookie(req);
        if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
        const ownerAId = userIdOrResponse;

        const { pet_name, pet_image } = await req.json();

        const petAAavatar = pet_image;
        const petAName = pet_name;

        const isMatched = await checkIfAlreadyLiked(petAId, petBId);
        console.log('Match status:', isMatched);

        if (isMatched) {
            const roomId = await createChatRoom(petAId, petAAavatar, petAName, ownerAId, petBId);
            await enableChatForpets(petAId, petBId, roomId);

            // Tạo đối tượng MatchedItem thay vì trả về roomId
            const matchedItem = new MatchedItem({
                room_id: roomId,
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
        console.error('Error in POST handler:', error);
        return NextResponse.json({ message: 'Có lỗi xảy ra'}, { status: 500 });
    }
}
