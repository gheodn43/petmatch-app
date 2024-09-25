'use client'
import React, { useState } from "react";
import SideHeader from "@/components/headers/sideHeader";

export default function SideLayout({
    children, 
    conversation,
    matching
}: {
    children: React.ReactNode,
    conversation: React.ReactNode,
    matching: React.ReactNode
}) {
    // Trạng thái để kiểm tra nút nào đang được chọn
    const [activeTab, setActiveTab] = useState<string>("chat");

    return (
        <>
            <div className="hidden md:block"><SideHeader /></div>
            {/* Thanh điều hướng cho các tab (chỉ hiển thị trên màn hình md trở lên) */}
            <div className="hidden md:flex justify-center mt-2 space-x-4 font-bold">
                <button 
                    className={`px-4 py-1 ${activeTab === 'chat' ? 'border-b-4 border-secondary border-solid text-secondary' : 'text-gray-300'}`}
                    onClick={() => setActiveTab("chat")}
                >
                   Tin Nhắn
                </button>
                <button 
                    className={`px-4 py-1 ${activeTab === 'matching' ? 'border-b-4 border-secondary border-solid text-secondary' : 'text-gray-300'}`}
                    onClick={() => setActiveTab("matching")}
                >
                    Tương Hợp
                </button>
            </div>
            
            {/* Nội dung theo tab trên màn hình md trở lên */}
            <div className="hidden md:block mt-4">
                {activeTab === "chat" && <div className="bg-red-500 h-full">{conversation}</div>}
                {activeTab === "matching" && <div>{matching}</div>}
            </div>

            {/* Nội dung dưới màn hình md: hiển thị cả 2 phần matching và conversation */}
            <div className="block md:hidden mt-4 space-y-4">
                <div>{matching}</div>
                <div className="bg-red-500">{conversation}</div>
            </div>

            {children}
        </>
    );
}
