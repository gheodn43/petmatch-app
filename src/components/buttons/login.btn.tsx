'use client';
import { useState } from 'react';
import LoginModal from '@/components/login/LoginModal';
import { Button } from '@headlessui/react';

export default function LoginBtn() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  return (
    <>
      <Button
        className="h-12 w-72 md:w-40 px-8 md:px-6  font-black font-sans text-white border-2 rounded-[25px] hover:bg-white hover:bg-opacity-10"
        onClick={handleLogin}>
        Đăng Nhập
      </Button>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
