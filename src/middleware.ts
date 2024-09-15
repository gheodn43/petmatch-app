import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
//   const token = request.cookies.get('refreshToken');
//   const redirectUrl = new URL('/signin', request.url);

//   if (!token && request.nextUrl.pathname !== '/signin') {
//     redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   if (token && request.nextUrl.pathname === '/signin') {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*'],
};
