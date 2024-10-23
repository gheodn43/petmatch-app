import { NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 100; // Fetch all or a large batch

    const params: ScanCommandInput = {
      TableName: 'petmatch-blog',
      Limit: limit, // Dynamically control the number of items retrieved
    };

    const command = new ScanCommand(params);
    const response = await dynamoDB.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json({ blogs: [] }, { status: 200 });
    }

    const blogs = response.Items.map((item) => ({
      blogId: item.blog_id?.S ?? '',
      title: item.title?.S ?? '',
      category: item.category?.S ?? '',
      content: item.content?.S ?? '',
      authorId: item.user_id?.S ?? '',
      createdAt: item.created_at?.S ?? '',
    }));

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Unable to fetch blogs.' },
      { status: 500 }
    );
  }
}