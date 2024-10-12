import { NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({}); // Tạo client DynamoDB

// Hàm GET để lấy danh sách blog với lazy loading
export async function GET() {
  try {
    // Lấy các query parameters từ URL
    const limit = 10; // Số lượng blog muốn lấy mỗi lần a cuối cùng từ lần request trước đó (dành cho phân trang)

    // Cấu hình lệnh ScanCommand với phân trang
    const params: ScanCommandInput = {
      TableName: 'petmatch-blog',
      Limit: limit, // Giới hạn số lượng blog mỗi lần lấy
    };
    const command = new ScanCommand(params);
    const response = await dynamoDB.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json({ blogs: [], lastKey: null }, { status: 200 });
    }

    // Chuyển đổi kết quả từ DynamoDB thành các đối tượng blog
    const blogs = response.Items.map((item) => ({
      blogId: item.blog_id.S || '',
      title: item.title.S || '',
      category: item.category.S || '',
      content: item.content.S || '',
      authorId: item.user_id.S || '',
      createdAt: item.created_at.S || '',
    }));

    // `lastEvaluatedKey` sẽ có giá trị nếu còn dữ liệu phía sau
    const lastEvaluatedKey = response.LastEvaluatedKey?.blog_id?.S || null;

    // Phản hồi với danh sách blog và khóa cuối cùng (dành cho phân trang)
    return NextResponse.json({ blogs, lastKey: lastEvaluatedKey }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs with lazy loading:', error);
    return NextResponse.json({ error: 'Không thể lấy danh sách blog.' }, { status: 500 });
  }
}
