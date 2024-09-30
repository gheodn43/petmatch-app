import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Blog } from '@/app/model/blog';

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { blogId: string } }) {
  const { blogId } = params;

  try {
    const command = new GetItemCommand({
      TableName: 'petmatch-blog',
      Key: {
        blog_id: { S: blogId }
      }
    });

    const response = await dynamoDB.send(command);
    if (!response.Item) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blog: Blog = {
      blogId: response.Item.blog_id.S || '',
      title: response.Item.title.S || '',
      category: response.Item.category.S || '',
      content: response.Item.content.S || '',
      imageUrl: response.Item.image_url.L?.map((img) => img.S || '') || [],
      authorId: response.Item.user_id.S || '',
      createdAt: response.Item.created_at.S || ''
    };

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return NextResponse.json({ error: 'Error fetching blog details' }, { status: 500 });
  }
}
