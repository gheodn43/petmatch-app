'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter để điều hướng
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShield, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function BlogHeader() {
  const router = useRouter(); // Khởi tạo useRouter

  return (
    <div className="fixed flex justify-between items-center bg-gradient-to-r from-secondary to-yellow-300 h-16 p-4 cursor-pointer w-full">
      <div
        className="flex items-center space-x-2"
        onClick={() => {
          router.back(); // Quay lại trang trước đó
        }}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2xl"
          className="text-white rounded-full responsive-text hover:text-primary hover:bg-secondary w-6 h-6"
        />
      </div>
      <div className="flex justify-center items-center space-x-4 rounded-full hover:bg-primary/35 py-1 pl-1 pr-4 ml-10">
        <img
          src={'/images/logo-color.png'}
          alt={`Logo`}
          className="h-10 w-10 rounded-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        <FontAwesomeIcon
          icon={faComment}
          className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary"
        />
        <FontAwesomeIcon
          icon={faShield}
          className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary"
        />
      </div>
    </div>
  );
}
