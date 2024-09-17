import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify, decodeJwt } from 'jose';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json({ message: 'JWT secret is not defined.' }, { status: 500 });
  }

  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const accessToken = cookies.access_token;
  const url = new URL(request.url);

  if (accessToken) {
    try {
      // Xác thực token
      await jwtVerify(accessToken, new TextEncoder().encode(JWT_SECRET));
      
      // Nếu người dùng đang truy cập vào '/', chuyển hướng đến '/home' nếu token còn hiệu lực
      if (url.pathname === '/') {
        return NextResponse.redirect(new URL('/home', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Kiểm tra lỗi và xử lý
      if (err instanceof Error && err.message.includes('JWT expired')) {
        try {
          // Giải mã token
          const decoded = decodeJwt(accessToken) as { user_id: string; user_email: string };

          // Tạo token mới
          const newAccessToken = await new SignJWT({ user_id: decoded.user_id, user_email: decoded.user_email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(new TextEncoder().encode(JWT_SECRET));

          // Tạo phản hồi với token mới
          const response = NextResponse.next();
          response.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600 * 24 * 7,
            path: '/',
          });

          // Nếu người dùng đang truy cập vào '/', chuyển hướng đến '/home' sau khi làm mới token
          if (url.pathname === '/') {
            return NextResponse.redirect(new URL('/home', request.url));
          }

          return response;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          return NextResponse.redirect(new URL('/', request.url));
        }
      } else {
        console.error('Invalid token:', err);
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } else {
    // Nếu không có token, cho phép tiếp tục truy cập các route khác
    if (url.pathname === '/') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/', '/home'],
};
