import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

const dynamoDB = new DynamoDBClient({});

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    try {
        const paramsUpdate = {
            TableName: 'petmatch-chat-room',
            Key: {
                room_id: { S: roomId }
            },
            UpdateExpression: 'SET start_chating = :trueValue',
            ExpressionAttributeValues: {
                ':trueValue': { BOOL: true }
            }
        };
        await dynamoDB.send(new UpdateItemCommand(paramsUpdate));
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
