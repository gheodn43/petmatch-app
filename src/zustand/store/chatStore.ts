import { create } from 'zustand';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
}

interface ChatState {
  chatrooms: { [roomId: string]: ChatMessage[] }; // Lưu tin nhắn của từng phòng chat
  addMessagesToRoom: (roomId: string, messages: ChatMessage[]) => void;
  updateMessagesForRoom: (roomId: string, newMessages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatrooms: {},

  // Hàm thêm tin nhắn mới vào phòng chat
  addMessagesToRoom: (roomId, messages) =>
    set((state) => ({
      chatrooms: {
        ...state.chatrooms,
        [roomId]: [...(state.chatrooms[roomId] || []), ...messages],
      },
    })),

  // Hàm cập nhật tin nhắn mới cho phòng chat
  updateMessagesForRoom: (roomId, newMessages) =>
    set((state) => ({
      chatrooms: {
        ...state.chatrooms,
        [roomId]: newMessages,
      },
    })),
}));
