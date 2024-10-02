import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Tạo một phản hồi NextResponse
    const response = NextResponse.json({ message: 'Logout successful.' }, { status: 200 });

    // Xóa cookie `access_token`
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Đặt thời gian hết hạn cookie về 0 để xóa nó
      path: '/',
    });

    // Xóa cookie `user_info`
    response.cookies.set('user_info', '', {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Đặt thời gian hết hạn cookie về 0 để xóa nó
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
