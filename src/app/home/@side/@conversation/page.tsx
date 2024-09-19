'use client'

import { useRouter } from 'next/navigation';

// Dữ liệu giả cho người dùng đã match (dummy matched users)
const matchedUsers = [
  { id: 'user1', name: 'John Doe' },
  { id: 'user2', name: 'Jane Smith' },
  { id: 'user3', name: 'Alice Johnson' },
];

interface UserCardProps {
  user: { id: string; name: string };
  senderPetId: string;   // Pet ID của người gửi
}

const UserCard: React.FC<UserCardProps> = ({ user, senderPetId }) => {
  const router = useRouter(); // Sử dụng useRouter từ next/navigation

  const handleClick = () => {
    const receiverPetId = "receiverPet123";  // Lấy Pet ID của người nhận từ dữ liệu giả
    router.push(`/chat/${senderPetId}/${receiverPetId}`); // Điều hướng tới trang chat
  };

  return (
    <div 
      className="p-4 border border-gray-300 cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">Click to chat with pet</p>
    </div>
  );
};

interface SidebarProps {
  matchedUsers: { id: string; name: string }[];
  senderPetId: string;   // Pet ID của người gửi
}

const ConversationSection: React.FC<SidebarProps> = ({ matchedUsers, senderPetId }) => {
  return (
    <div className="w-64 bg-gray-100 h-full">
      {/* Lặp qua danh sách matchedUsers và render UserCard cho từng người */}
      {matchedUsers.map((user) => (
        <UserCard key={user.id} user={user} senderPetId={senderPetId} />
      ))}
    </div>
  );
};

// Component thử nghiệm toàn bộ chức năng với dữ liệu giả
const TestConversationSection = () => {
  const senderPetId = "pet123"; // Pet ID của người gửi (giả lập)
  
  return (
    <div>
      <h2>Dummy Matched Users</h2>
      <ConversationSection matchedUsers={matchedUsers} senderPetId={senderPetId} />
    </div>
  );
};

export default TestConversationSection;
