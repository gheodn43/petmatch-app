// api/chat/[roomId]/send/route.ts

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher'; // Pusher server instance
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/app/model/message';

const dynamoDB = new DynamoDBClient({});

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;

    try {
        const { message, senderId, senderName } = await req.json();
        console.log(message, senderId, senderName)
        if (!message || !senderId || !senderName) {
            return NextResponse.json({ error: 'Missing message data' }, { status: 400 });
        }
        const messageId = uuidv4();
        const createdAt = new Date().toISOString();

        // Lưu tin nhắn vào DynamoDB
        const newMessage: Message = {
            id: messageId,
            roomId,
            senderId,
            senderName,
            content: message,
            createdAt
        };

        // Phát sự kiện qua Pusher để cập nhật tin nhắn mới
        await pusherServer.trigger(`private-chat-${roomId}`, 'new-message', newMessage);
        const command = new PutItemCommand({
            TableName: 'petmatch-messages',
            Item: {
                room_id: { S: roomId },
                message_id: { S: messageId },
                senderId: { S: senderId },
                senderName: { S: senderName },
                content: { S: message },
                createdAt: { S: createdAt }
            }
        });

        await dynamoDB.send(command);
        console.log(newMessage)
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
