// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({});

export async function POST(req: Request) {
  const { user_email, password } = await req.json();

  if (!user_email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  try {
    const queryParams = {
      TableName: 'petmatch-users',
      IndexName: 'EmailIndex', 
      KeyConditionExpression: 'user_email = :email',
      ExpressionAttributeValues: {
        ':email': { S: user_email },
      },
    };

    const { Items } = await dynamoDB.send(new QueryCommand(queryParams));

    if (!Items || Items.length === 0 || !Items[0].password || !Items[0].password.S) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    const hashedPassword = Items[0].password.S;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
