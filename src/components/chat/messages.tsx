'use client'
import { pusherClient } from '@/lib/pusher'
import { FC, useEffect, useState } from 'react'
import { Message } from '@/app/model/message';

interface MessagesProps {
  initialMessages: Message[],
  roomId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, roomId }) => {
  const [incomingMessages, setIncomingMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-chat-${roomId}`);
    channel.bind('new-message', (message: Message) => {
        setIncomingMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      pusherClient.unsubscribe(`private-chat-${roomId}`);
    }
  }, [roomId]);

  return (
    <div>
      {incomingMessages.map((msg) => (
         <div key={msg.id} className="mb-2">
         <div className="text-sm text-gray-500">{msg.senderName}</div>
         <div className="p-2 bg-white rounded shadow">{msg.content}</div>
     </div>
      ))}
    </div>
  )
}

export default Messages;
