import { NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const dynamoDB = new DynamoDBClient({});
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: Request) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ message: 'JWT secret is not defined.' }, { status: 500 });
    }
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const accessToken = cookies.access_token;

    if (!accessToken) {
      return NextResponse.json({ message: 'Access token is missing.' }, { status: 401 });
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired access token.' }, { status: 401 });
    }
    const { user_id } = decodedToken as { user_id: string };

    if (!user_id) {
      return NextResponse.json({ message: 'Invalid access token payload.' }, { status: 401 });
    }
    const queryParams = {
      TableName: 'petmatch-pets',
      KeyConditionExpression: 'user_id = :user_id',
      ExpressionAttributeValues: {
        ':user_id': { S: user_id },
      },
    };
    const { Items } = await dynamoDB.send(new QueryCommand(queryParams));
    if (!Items || Items.length === 0) {
      return NextResponse.json({ message: 'No pets found for this user.' }, { status: 404 });
    }
    const pets = Items.map((item) => ({
      pet_id: item.pet_id.S,
      pet_name: item.pet_name.S,
      pet_age: item.pet_age.N,
      pet_type: item.pet_type.S,
      pet_img1: item.pet_img1.S,
    }));
    return NextResponse.json({ pets }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
