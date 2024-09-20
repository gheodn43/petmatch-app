export interface Message {
    id: string;                // Mã định danh của tin nhắn (có thể là UUID hoặc ID từ database)
    roomId: string;            // Mã định danh của phòng chat (để biết tin nhắn thuộc phòng nào)
    senderId: string;          // ID của người gửi tin nhắn
    senderName: string;        // Tên của người gửi (hiển thị trong giao diện)
    content: string;           // Nội dung của tin nhắn
    createdAt: string;         // Thời gian tin nhắn được gửi (định dạng ISO string hoặc timestamp)
}
