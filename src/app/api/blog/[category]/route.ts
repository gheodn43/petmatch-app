import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { Blog } from '@/app/model/blog';

// Cấu hình DynamoDBClient với region và credentials
const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
  const { category } = params;
  try {
    if (!category) {
      return NextResponse.json({ error: 'Thiếu category trong yêu cầu' }, { status: 400 });
    }

    // Sử dụng ScanCommand để lọc theo category
    const command = new ScanCommand({
      TableName: 'petmatch-blog',
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': { S: category }
      },
      Limit: 50,
    });

    const response = await dynamoDB.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Chuyển đổi dữ liệu từ DynamoDB sang kiểu dữ liệu Blog
    const blogs: Blog[] = response.Items.map((item) => ({
      blogId: item.blog_id?.S || '',
      title: item.title?.S || '',
      category: item.category?.S || '',
      content: item.content?.S || '',
      imageUrl: item.image_url?.L?.map((img) => img.S || '') || [], // imageUrl là một mảng các URL
      authorId: item.user_id?.S || '',
      createdAt: item.created_at?.S || ''
    }));

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Không thể lấy dữ liệu blog' }, { status: 500 });
  }
}
