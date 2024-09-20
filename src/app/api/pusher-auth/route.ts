import { pusherServer } from '@/lib/pusher';
import { getUserIdFromCookie } from '@/utils/authUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Lấy user ID từ cookie
    const userIdOrResponse = await getUserIdFromCookie(req);
    if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
    const user_id = userIdOrResponse;

    try {
        // Lấy và phân tách dữ liệu từ request body
        const body = await req.text();
        const params = new URLSearchParams(body);
        const socketId = params.get('socket_id');
        const channelName = params.get('channel_name');

        if (!socketId || !channelName) {
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        // Tạo thông tin xác thực với Pusher
        const auth = pusherServer.authorizeChannel(socketId, channelName);
        
        return NextResponse.json(auth, { status: 200 });
    } catch (error) {
        console.error('Error authorizing Pusher channel:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
