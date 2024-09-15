import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Kiểm tra xem cookie 'access_token' có tồn tại không
  const accessToken = request.cookies.get('access_token');

  // Nếu tồn tại cookie 'access_token', điều hướng đến trang /home
  if (accessToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Nếu không có cookie 'access_token', cho phép tiếp tục truy cập trang /
  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // Áp dụng middleware cho đường dẫn '/'
};
