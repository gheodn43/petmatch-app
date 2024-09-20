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
            <SideHeader />
            <div className="flex justify-center mt-2 space-x-4 font-bold ">
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
            <div className="mt-4">
                {activeTab === "chat" && <div className="bg-red-500 h-full0">{conversation}</div>}
                {activeTab === "matching" && <div className="bg-green-400">{matching}</div>}
            </div>
            {children}
        </>
    );
}
