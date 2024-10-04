'use client'
import React, { useState, useEffect } from 'react';
import PetCardSkeleton from "@/components/skeletonLoading/petcardSkeleton";

export default function TestUI() {
    const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

    useEffect(() => {
        // Tạo delay mô phỏng việc tải dữ liệu
        const timer = setTimeout(() => {
            setIsLoading(false); // Hết thời gian delay, dừng hiển thị skeleton
        }, 3000); // 3 giây delay

        // Dọn dẹp timer sau khi component bị unmount
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-black h-full md:py-16">
            {isLoading ? (
                <PetCardSkeleton /> // Hiển thị Skeleton Loader khi đang loading
            ) : (
                <div className="text-xl font-bold">Nội dung đã tải xong!</div> // Nội dung thực tế sau khi tải
            )}
        </div>
    );
}
