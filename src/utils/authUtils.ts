import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export async function getUserIdFromCookie(req: NextRequest): Promise<string | NextResponse> {
    if (!JWT_SECRET) {
        return NextResponse.json({ message: 'JWT secret is not defined.' }, { status: 500 });
    }
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const accessToken = cookies.access_token;

    if (!accessToken) {
        return NextResponse.json({ message: 'Access token is missing.' }, { status: 401 });
    }
    try {
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const { user_id } = decodedToken as { user_id: string };
        if (!user_id) {
            return NextResponse.json({ message: 'Invalid access token payload.' }, { status: 401 });
        }
        return user_id;
    } catch (err) {
        return NextResponse.json({ message: 'Invalid or expired access token.' }, { status: 401 });
    }
}
