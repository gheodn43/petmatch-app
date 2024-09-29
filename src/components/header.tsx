'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginBtn from '@/components/buttons/login.btn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle the menu
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close the menu when clicking outside or on the icon
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-icon') && !target.closest('.menu')) {
            setIsMenuOpen(false);
        }
    };

    // Add/remove event listener for clicks outside the menu
    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className="w-full px-4 h-[10vh] bg-gradient-to-b from-black via-transparent to-transparent header-gradient flex items-center justify-between">
            <div className="flex items-end space-x-2">
                <img
                    src="/images/logo-white.png"
                    alt="Logo"
                    className="w-[50px] sm:w-[50px] md:w-[60px] lg:w-[80px]"
                />
                <span className="text-white font-jomhuria font-bold text-[1.5rem] sm:text-[1.5rem] md:text-[1.8rem] lg:text-[2.2rem] tracking-wide">
                    Petmatch
                </span>
            </div>
            
            {/* Links for larger screens */}
            <div className="hidden md:flex items-end space-x-6 text-white">
                <Link href="/">
                    <p className="responsive-text leading-6 font-nunito">
                        Diễn Đàn
                    </p>
                </Link>
                <Link href="/">
                    <p className="responsive-text leading-6 font-nunito">
                        Tư Vấn
                    </p>
                </Link>
                <Link href="/">
                    <p className="responsive-text leading-6 font-nunito">
                        Về Chúng Tôi
                    </p>
                </Link>
            </div>

            {/* Bars icon for small screens */}
            <div className="md:hidden flex items-center">
                <FontAwesomeIcon
                    icon={faBars}
                    className="text-white text-2xl menu-icon cursor-pointer"
                    onClick={handleMenuToggle}
                />
            </div>

            {/* Login Button - only show on medium screens and up */}
            <div className="hidden md:block">
                <LoginBtn />
            </div>

            {/* Dropdown menu for small screens */}
            {isMenuOpen && (
                <div className="absolute top-[10vh] right-0 w-40 bg-black text-white shadow-md p-4 menu">
                    <Link href="/">
                        <p className="pb-2 border-b border-gray-600">Diễn Đàn</p>
                    </Link>
                    <Link href="/">
                        <p className="py-2 border-b border-gray-600">Tư Vấn</p>
                    </Link>
                    <Link href="/">
                        <p className="pt-2">Về Chúng Tôi</p>
                    </Link>
                </div>
            )}
        </header>
    );
}
