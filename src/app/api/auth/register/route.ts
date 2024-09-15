// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const dynamoDB = new DynamoDBClient({});
const JWT_SECRET = process.env.JWT_SECRET; 

export async function POST(req: Request) {
  const { credential } = await req.json();

  if (!credential) {
    return NextResponse.json({ message: 'Credential is required.' }, { status: 400 });
  }

  try {
    const decodedToken = jwt.decode(credential) as { email: string, name: string, picture: string } | null;
    if (!decodedToken || !decodedToken.email) {
      return NextResponse.json({ message: 'Invalid credential.' }, { status: 400 });
    }
    const user_email = decodedToken.email;
    const user_picture = decodedToken.picture;
    const user_name = decodedToken.name;
    const queryParams = {
      TableName: 'petmatch-users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'user_email = :email',
      ExpressionAttributeValues: {
        ':email': { S: user_email },
      },
    };

    const { Items } = await dynamoDB.send(new QueryCommand(queryParams));
    let user_id;

    if (Items && Items.length > 0) {
      user_id = Items[0].user_id.S; 
    } else {
      user_id = uuidv4();
      const putItemParams = {
        TableName: 'petmatch-users',
        Item: {
          user_id: { S: user_id },
          user_name: { S: user_name }, 
          user_email: { S: user_email },
          user_picture: { S: user_picture },
          user_role: { S: 'free' }, 
          user_dob: { S: '' }, 
          password: { S: '' },
        },
      };
      await dynamoDB.send(new PutItemCommand(putItemParams));
    }

    // Tạo access token và thông tin người dùng
    const accessToken = jwt.sign({ user_id, user_email }, JWT_SECRET!, { expiresIn: '1h' });

    // Tạo cookie
    const cookies = [
      cookie.serialize('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng https trong môi trường production
        maxAge: 3600*24*7,
        path: '/',
      }),
      cookie.serialize('user_info', JSON.stringify({
        user_role: Items ? Items[0].user_role.S : 'free',
        user_image: user_picture,
        user_name: user_name
      }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng https trong môi trường production
        maxAge: 3600*24*7,
        path: '/',
      }),
    ];

    return new NextResponse(JSON.stringify({ message: 'User registered and login successful.' }), {
      status: 201,
      headers: {
        'Set-Cookie': cookies.join('; '),
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
