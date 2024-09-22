import { pusherServer } from '@/lib/pusher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const params = new URLSearchParams(body);
        const socketId = params.get('socket_id');
        const channelName = params.get('channel_name');

        if (!socketId || !channelName) {
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }
        const auth = pusherServer.authorizeChannel(socketId, channelName);
        return NextResponse.json(auth, { status: 200 });
    } catch (error) {
        console.error('Error authorizing Pusher channel:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
