import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Blog } from '@/app/model/blog';

// Tạo client cho DynamoDB
const dynamoDB = new DynamoDBClient({});

// Hàm GET để lấy chi tiết blog theo blogId
export async function GET(req: NextRequest, { params }: { params: { blogId: string } }) {
  const { blogId } = params;

  try {
    const command = new GetItemCommand({
      TableName: 'petmatch-blog', // Tên bảng blog trong DynamoDB
      Key: {
        blog_id: { S: blogId } // Sử dụng blog_id để lấy chi tiết blog
      }
    });

    const response = await dynamoDB.send(command); // Gửi yêu cầu lên DynamoDB

    // Kiểm tra nếu không tìm thấy blog
    if (!response.Item) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Tạo đối tượng Blog mà không có imageUrl
    const blog: Blog = {
      blogId: response.Item.blog_id.S || '',
      title: response.Item.title.S || '',
      category: response.Item.category.S || '',
      content: response.Item.content.S || '',
      authorId: response.Item.user_id.S || '',
      createdAt: response.Item.created_at.S || ''
    };

    // Trả về dữ liệu blog mà không có image_url
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return NextResponse.json({ error: 'Error fetching blog details' }, { status: 500 });
  }
}
