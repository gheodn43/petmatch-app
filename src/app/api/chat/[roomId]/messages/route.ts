import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/app/model/message';  // Import model Message đã định nghĩa

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    try {
        const command = new QueryCommand({
            TableName: 'petmatch-messages',
            KeyConditionExpression: 'room_id = :roomId',
            ExpressionAttributeValues: {
                ':roomId': { S: roomId }
            },
            Limit: 50,
            ScanIndexForward: false, // Sắp xếp ban đầu theo thứ tự giảm dần
        });

        const response = await dynamoDB.send(command);
        if (!response.Items || response.Items.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const messages: Message[] = response.Items.map((item) => {
            const id = item.message_id?.S || '';  
            const roomId = item.room_id?.S || '';  
            const senderId = item.senderId?.S || '';  
            const senderName = item.senderName?.S || ''; 
            const content = item.content?.S || ''; 
            const createdAt = item.createdAt?.S || ''; 

            return {
                id,
                roomId,
                senderId,
                senderName,
                content,
                createdAt
            };
        });
        messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Không thể lấy tin nhắn' }, { status: 500 });
    }
}
