'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShield } from '@fortawesome/free-solid-svg-icons';

interface UserInfor {
    user_image: string;
    user_name: string;
}

const defaultUserInfo: UserInfor = {
    user_image: '/images/default-avatar.jpg',
    user_name: '',
};

export default function LoginedHeader() {
    const [userInfor, setUserInfor] = useState<UserInfor>(defaultUserInfo);
    const router = useRouter();

    const handleToHome = () => {
        router.push('/home');
    };

    useEffect(() => {
        const getUserInforFromCookie = (): UserInfor => {
            const cookieString = document.cookie
                .split('; ')
                .find((row) => row.startsWith('user_info='));
            if (cookieString) {
                const cookieValue = cookieString.split('=')[1];
                try {
                    return JSON.parse(decodeURIComponent(cookieValue));
                } catch (error) {
                    console.error('Error parsing cookie', error);
                }
            }
            return defaultUserInfo;
        };

        const userInforFromCookie = getUserInforFromCookie();
        setUserInfor(userInforFromCookie);
    }, []);

    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-secondary to-yellow-300 h-16 p-4 cursor-pointer">
            <div className="flex items-center space-x-4 py-1 pl-1 pr-4">
                <img
                    src="/images/logo-white.png"
                    alt="Logo"
                    className="w-[50px] sm:w-[50px] md:w-[60px] lg:w-[70px]"
                    onClick={handleToHome}
                />
            </div>
            <div className='flex items-center space-x-4'>
                <FontAwesomeIcon icon={faComment} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
                <FontAwesomeIcon icon={faShield} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
                <img
                    src={userInfor.user_image}
                    alt={`${userInfor.user_name}'s avatar`}
                    className="h-10 w-10 rounded-full"/>
                <span className="responsive-text text-white font-bold">{userInfor.user_name}</span>
            </div>
        </div>
    );
}
