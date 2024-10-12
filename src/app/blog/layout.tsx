'use client';
import BlogHeader from '@/components/headers/blogHeader';
import React from 'react';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div>
        <BlogHeader/>
        <div className='pt-27-20 pt-20 bg-[#FFF9E4] min-h-screen p-6'>
        {children}
      </div>
      </div>
  );
}
