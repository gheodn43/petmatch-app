import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify, decodeJwt, JWTPayload } from 'jose';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json({ message: 'JWT secret is not defined.' }, { status: 500 });
  }

  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const accessToken = cookies.access_token;
  const url = new URL(request.url);

  // Kiểm tra nếu đang ở trang đăng nhập hoặc trang công khai không cần xác thực
  if (url.pathname === '/signin') {
    // Nếu không có token và đang ở trang đăng nhập, cho phép truy cập
    if (!accessToken) {
      return NextResponse.next();
    }
    // Nếu có token và đang ở trang đăng nhập, chuyển hướng đến trang chính
    try {
      await jwtVerify(accessToken, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.redirect(new URL('/home', request.url));
    } catch {
      return NextResponse.next();
    }
  }

  if (accessToken) {
    try {
      // Xác thực token
      const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(JWT_SECRET));
      if (url.pathname === '/') {
        return NextResponse.redirect(new URL('/home', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      if (err instanceof Error && err.name === 'JWTExpired') {
        // Token hết hạn, làm mới token
        try {
          const decoded = decodeJwt(accessToken) as { user_id: string; user_email: string };

          // Tạo token mới
          const newAccessToken = await new SignJWT({
            user_id: decoded.user_id,
            user_email: decoded.user_email,
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(new TextEncoder().encode(JWT_SECRET));

          // Đặt token mới vào cookie
          const response = NextResponse.next();
          response.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600 * 24 * 7, // Token có hiệu lực trong 1 tuần
            path: '/',
          });

          // Kiểm tra người dùng có đang ở trang root không để tránh vòng lặp
          if (url.pathname === '/') {
            return NextResponse.redirect(new URL('/home', request.url));
          }

          return response;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Chuyển hướng về trang đăng nhập nếu không thể làm mới token
          return NextResponse.redirect(new URL('/signin', request.url));
        }
      } else {
        console.error('Invalid token:', err);
        // Token không hợp lệ hoặc lỗi khác
        return NextResponse.redirect(new URL('/signin', request.url));
      }
    }
  } else {
    // Không có token, chuyển hướng về trang đăng nhập
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/', '/home', '/signin', '/membership-pkgs/:path*', '/pet/:path*']
};
