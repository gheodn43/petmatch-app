import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const senderPetId = searchParams.get('senderPetId');
  const receiverPetId = searchParams.get('receiverPetId');

  if (!senderPetId || !receiverPetId) {
    return NextResponse.json({ error: 'Missing senderPetId or receiverPetId' }, { status: 400 });
  }

  try {
    const messages = await getMessagesFromDynamoDB(senderPetId, receiverPetId);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

const getMessagesFromDynamoDB = async (
  senderPetId: string,
  receiverPetId: string
): Promise<any[]> => {
  const PK = `${senderPetId}#${receiverPetId}`;

  const params = {
    TableName: 'ChatMessages',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': PK,
    },
    ScanIndexForward: true, // Sắp xếp tin nhắn từ cũ đến mới
  };

  try {
    const data = await dynamoDB.query(params).promise();
    return data.Items || [];
  } catch (error) {
    console.error('Error retrieving messages from DynamoDB', error);
    throw error;
  }
};
