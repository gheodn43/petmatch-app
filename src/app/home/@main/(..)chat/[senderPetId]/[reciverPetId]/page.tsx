'use client'

import { useParams } from 'next/navigation';
import ChatBox from '@/components/chat/ChatBox';  // Giả sử ChatBox nằm trong /components/chat

const ChatPage = () => {
  const params = useParams();

  console.log(params);
  console.log(params.receiverPetId);
  console.log(params.senderPetId);
  
  
  // Ép kiểu giá trị senderPetId và receiverPetId thành chuỗi
  const senderPetId = Array.isArray(params.senderPetId) ? params.senderPetId[0] : params.senderPetId;
  const receiverPetId = Array.isArray(params.receiverPetId) ? params.receiverPetId[0] : params.receiverPetId;

  return (
    <div className="container mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Chat between {senderPetId} và {receiverPetId}</h1>
      <ChatBox senderId={senderPetId} senderPetId={senderPetId} receiverId={receiverPetId} receiverPetId={receiverPetId} />
    </div>
  );
};

export default ChatPage;
