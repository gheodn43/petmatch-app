'use client';
import { useState } from 'react';
import LoginModal from '@/components/login/LoginModal';

export default function LoginBtn() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  return (
    <>
      <button
        className="responsive-text px-8 py-3 md:px-6 font-semibold font-Nunito leading-6 text-white border rounded-[30px] hover:bg-white hover:bg-opacity-10"
        onClick={handleLogin}
      >
        Đăng Nhập
      </button>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
