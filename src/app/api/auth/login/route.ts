import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SignJWT, decodeJwt } from 'jose';


const dynamoDB = new DynamoDBClient({});
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { credential } = await req.json();

  if (!credential) {
    return NextResponse.json({ message: 'Credential is required.' }, { status: 400 });
  }

  try {
    const decodedToken = decodeJwt(credential) as { email: string; name: string; picture: string } | null;
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
    const accessToken = await new SignJWT({ user_id, user_email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Create NextResponse
    const response = NextResponse.json({ message: 'User registered and login successful.' }, { status: 201 });

    // Set cookies
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 24 * 7,
      path: '/',
    });

    response.cookies.set('user_info', JSON.stringify({
      user_role: Items && Items[0].user_role.S ? Items[0].user_role.S : 'free',
      user_image: user_picture,
      user_name: user_name,
    }), {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
