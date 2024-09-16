import React from "react";
import SideHeader from "@/components/headers/sideHeader";
export default function SideLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>
        <SideHeader/>
        {children}
    </>
}