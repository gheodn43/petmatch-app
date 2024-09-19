
import React from "react";
import LoginedHeader from "@/components/headers/loginedHeader";
export default function SideLayout({
    children, 
}: {
    children: React.ReactNode,
}) {
    return (
        <>
        <LoginedHeader/>
            {children}
        </>
    );
}
