import { NextResponse, NextRequest } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { decodedToken } from '@/utils/decodeToken';
import { PetOverviewDto } from '@/app/model/pet';

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;
  if (!accessToken) return NextResponse.json({ message: 'Access token is missing.' }, { status: 401 });
  const user_id = await decodedToken(accessToken);
  if (!user_id) return NextResponse.json({ message: 'Invalid Access Token' }, { status: 401 });
  try {
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

    const pets = Items.map((item) => {
      const petImages = item.pet_images?.L?.map(image => image.S ?? '') || [];
      return new PetOverviewDto({
        pet_id: item.pet_id.S ?? '',
        pet_name: item.pet_name.S ?? '',
        pet_type: item.pet_type.S ?? '',
        pet_species: item.pet_species.S ?? '',
        pet_image: petImages[0],
        pet_gender: item.pet_gender.S ?? '',
        pet_pricing: item.pet_pricing.S ?? '',
        pet_status: item.pet_status.S ?? '',
      });
    });

    return NextResponse.json({ pets }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}



