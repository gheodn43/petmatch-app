'use client';
import React from 'react';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className='pt-27-20'>
        {children}
      </div>
  );
}
