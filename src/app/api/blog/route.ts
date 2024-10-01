import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid'; // Để tạo UUID cho blogId
import { getUserIdFromCookie } from '@/utils/authUtils';

const dynamoDB = new DynamoDBClient({}); // Tạo client DynamoDB

// Hàm POST để tạo blog mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Đọc nội dung từ request body
    const { title, category, content } = body; // Không cần imageUrl

    console.log(body);
    
    // Lấy `authorId` từ cookie
    const userIdOrResponse = await getUserIdFromCookie(req);
    if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
    const authorId = userIdOrResponse;
    console.log(authorId);
    

    // Kiểm tra đầu vào
    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Thiếu thông tin tiêu đề, nội dung hoặc danh mục.' }, { status: 400 });
    }

    // Kiểm tra `authorId`
    if (!authorId || typeof authorId !== 'string') {
      return NextResponse.json({ error: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.' }, { status: 401 });
    }

    const blogId = uuidv4(); // Tạo ID duy nhất cho blog
    const createdAt = new Date().toISOString(); // Thời gian tạo

    // Tạo đối tượng blog để lưu vào DynamoDB
    const newBlog = {
      blogId,
      title,
      category,
      content,
      authorId,
      createdAt,
    };

    // Lệnh PutItemCommand để lưu blog mới vào DynamoDB
    const command = new PutItemCommand({
      TableName: 'petmatch-blog',
      Item: {
        blog_id: { S: newBlog.blogId },
        title: { S: newBlog.title },
        category: { S: newBlog.category },
        content: { S: newBlog.content },
        user_id: { S: newBlog.authorId },
        created_at: { S: newBlog.createdAt },
      },
    });

    // Gửi lệnh lên DynamoDB
    await dynamoDB.send(command);

    // Phản hồi thành công với dữ liệu blog mới
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Không thể tạo blog mới. Chi tiết lỗi: ' + (error as Error).message }, { status: 500 });
  }
}
