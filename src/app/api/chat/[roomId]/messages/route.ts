import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/app/model/message';  // Import model Message đã định nghĩa

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;

    try {
        // Thực hiện truy vấn tới DynamoDB
        const command = new QueryCommand({
            TableName: 'petmatch-messages',  // Tên bảng trong DynamoDB
            KeyConditionExpression: 'room_id = :roomId',
            ExpressionAttributeValues: {
                ':roomId': { S: roomId }
            },
            Limit: 50,  // Giới hạn 50 tin nhắn
            ScanIndexForward: false  // Đảo ngược thứ tự để lấy tin nhắn mới nhất
        });

        const response = await dynamoDB.send(command);

        // Kiểm tra xem phản hồi có tồn tại và không rỗng
        if (!response.Items || response.Items.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Chuyển đổi tin nhắn nhận được thành kiểu dữ liệu Message
        const messages: Message[] = response.Items.map((item) => {
            const id = item.message_id?.S || '';  // Trả về chuỗi rỗng nếu id không tồn tại
            const roomId = item.room_id?.S || '';  // Trả về chuỗi rỗng nếu roomId không tồn tại
            const senderId = item.senderId?.S || '';  // Trả về chuỗi rỗng nếu senderId không tồn tại
            const senderName = item.senderName?.S || '';  // Trả về chuỗi rỗng nếu senderName không tồn tại
            const content = item.content?.S || '';  // Trả về chuỗi rỗng nếu content không tồn tại
            const createdAt = item.createdAt?.S || '';  // Trả về chuỗi rỗng nếu createdAt không tồn tại

            return {
                id,
                roomId,
                senderId,
                senderName,
                content,
                createdAt
            };
        });
console.log(messages);
        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
        return NextResponse.json({ error: 'Không thể lấy tin nhắn' }, { status: 500 });
    }
}
