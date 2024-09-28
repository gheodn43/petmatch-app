import { getUserIdFromCookie } from '@/utils/authUtils';
import { NextResponse, NextRequest } from 'next/server';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({});

export async function POST(request: NextRequest) {
  try {
    const userIdOrResponse = await getUserIdFromCookie(request);
    if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
    const user_id = userIdOrResponse;

    const paymentInfoCookie = request.cookies.get('payment_info');
    if (!paymentInfoCookie) {
      return NextResponse.json({ message: 'Thông tin thanh toán không tồn tại.' }, { status: 400 });
    }

    const paymentInfo = JSON.parse(paymentInfoCookie.value);
    const { orderCode, packageName } = paymentInfo;

    if (!orderCode || !packageName) {
      return NextResponse.json({ message: 'Dữ liệu thanh toán không hợp lệ.' }, { status: 400 });
    }

    // Xử lý role
    const userRole = packageName === 'VIP' ? 'VIP' : 'Premium';
    const expiryDate = new Date();

    // Cộng thêm thời gian theo gói dịch vụ
    if (packageName === 'VIP') {
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Cộng 1 tháng
    } else if (packageName === 'Premium') {
      expiryDate.setMonth(expiryDate.getMonth() + 6); // Cộng 6 tháng
    }

    // Cập nhật user role và ngày hết hạn trong DynamoDB
    const updateParams = {
      TableName: 'petmatch-users',
      Key: { user_id: { S: user_id } },
      UpdateExpression: 'SET user_role = :role, expiry_date = :expiry',
      ExpressionAttributeValues: {
        ':role': { S: userRole },
        ':expiry': { S: expiryDate.toISOString() }
      }
    };

    await dynamoDB.send(new UpdateItemCommand(updateParams));
    const userInfoCookie = request.cookies.get('user_info');
    if (userInfoCookie) {
      const userInfo = JSON.parse(userInfoCookie.value);
      userInfo.user_role = userRole;
      const response = NextResponse.json({ message: 'Cập nhật vai trò người dùng thành công.' }, { status: 200 });
      response.cookies.set('user_info', JSON.stringify(userInfo), {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 24 * 7,
        path: '/',
      });
      return response;
    } else {
      return NextResponse.json({ message: 'Thông tin người dùng không tồn tại trong cookie.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error updating role.' }, { status: 500 });
  }
}
