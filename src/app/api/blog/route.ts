import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Blog } from '@/app/model/blog';
import { v4 as uuidv4 } from 'uuid'; // Để tạo UUID cho blogId

const dynamoDB = new DynamoDBClient({}); 

// Hàm POST để tạo blog mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Đọc nội dung từ request body
    const { title, category, content, imageUrl, authorId } = body;

    if (!title || !category || !content || !authorId) {
      return NextResponse.json({ error: 'Thiếu thông tin cần thiết trong yêu cầu' }, { status: 400 });
    }

    const blogId = uuidv4(); // Tạo ID duy nhất cho blog
    const createdAt = new Date().toISOString(); // Thời gian tạo

    // Tạo đối tượng blog để lưu vào DynamoDB
    const newBlog: Blog = {
      blogId,
      title,
      category,
      content,
      imageUrl,
      authorId,
      createdAt
    };

    // Lệnh PutItemCommand để lưu blog mới vào DynamoDB
    const command = new PutItemCommand({
      TableName: 'petmatch-blog',
      Item: {
        blog_id: { S: newBlog.blogId },
        title: { S: newBlog.title },
        category: { S: newBlog.category },
        content: { S: newBlog.content },
        image_url: { L: newBlog.imageUrl.map((url) => ({ S: url })) }, // Mảng URL ảnh
        user_id: { S: newBlog.authorId },
        created_at: { S: newBlog.createdAt },
      },
    });

    // Gửi lệnh lên DynamoDB
    await dynamoDB.send(command);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Không thể tạo blog mới' }, { status: 500 });
  }
}
