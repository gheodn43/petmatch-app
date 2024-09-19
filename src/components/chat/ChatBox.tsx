'use client'

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket: any;

interface ChatBoxProps {
  senderId: string;
  receiverId: string;
  senderPetId: string;    // Pet ID của người gửi
  receiverPetId: string;  // Pet ID của người nhận
}

const ChatBox: React.FC<ChatBoxProps> = ({ senderId, receiverId, senderPetId, receiverPetId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (!senderId || !receiverId || !senderPetId || !receiverPetId) return;

    socket = io();

    // Sử dụng GET request với query parameters để lấy tin nhắn
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/?senderPetId=${senderPetId}&receiverPetId=${receiverPetId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const messagesFromDB = await response.json();
        setMessages(messagesFromDB);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Lắng nghe tin nhắn mới từ WebSocket
    socket.on('receiveMessage', (messageData: any) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.disconnect();
    };
  }, [senderId, receiverId, senderPetId, receiverPetId]);

  const handleSend = () => {
    if (newMessage.trim() !== '' && senderId && receiverId && senderPetId && receiverPetId) {
      const messageData = { senderId, receiverId, senderPetId, receiverPetId, message: newMessage };
      socket.emit('sendMessage', messageData);  // Gửi tin nhắn qua WebSocket
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[400px] border border-gray-300 p-4 bg-gray-100">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-md ${
              msg.senderId === senderId ? 'bg-blue-400 text-white self-end' : 'bg-gray-200 self-start'
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
