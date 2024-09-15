import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({});
const SALT_ROUNDS = 10;

export async function POST(req: Request) {
  const { user_name, user_email, user_gender, user_dob, password } = await req.json();

  if (!user_name || !user_email || !user_gender || !user_dob || !password) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
  }
  try {
    const getItemParams = {
      TableName: 'petmatch-users',
      Key: {
        user_id: { S: user_email },
      },
    };
    const { Item } = await dynamoDB.send(new GetItemCommand(getItemParams));
    if (Item) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user_id = uuidv4();
    const putItemParams = {
      TableName: 'petmatch-users',
      Item: {
        user_id: { S: user_id },
        user_name: { S: user_name },
        user_email: { S: user_email },
        user_gender: { S: user_gender },
        user_dob: { S: user_dob },
        password: { S: hashedPassword },
      },
    };

    await dynamoDB.send(new PutItemCommand(putItemParams));

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}