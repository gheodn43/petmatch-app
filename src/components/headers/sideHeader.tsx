'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShield } from '@fortawesome/free-solid-svg-icons';

type UserInfor = {
    user_role: string;
    user_name: string;
    user_image: string;
};

export default function SideHeader() {
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
        return {
            user_role: 'free',
            user_name: 'test user',
            user_image:'https://t3.ftcdn.net/jpg/02/00/90/24/360_F_200902415_G4eZ9Ok3Ypd4SZZKjc8nqJyFVp1eOD6V.jpg',
        };
    };

    const [userInfor, setUserInfor] = useState<UserInfor>(getUserInforFromCookie());
    useEffect(() => {
        const userInforFromCookie = getUserInforFromCookie();
        setUserInfor(userInforFromCookie);
    }, []);

    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-secondary to-yellow-300 h-16 p-4 cursor-pointer">
            <div className="flex items-center space-x-4 rounded-full hover:bg-primary/35 py-1 pl-1 pr-4">
                <img
                    src={userInfor.user_image}
                    alt={`${userInfor.user_name}'s avatar`}
                    className="h-10 w-10 rounded-full"/>
                <span className="responsive-text text-white font-bold">{userInfor.user_name}</span>
            </div>
            <div className='flex items-center space-x-4'>
                <FontAwesomeIcon icon={faComment} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
                <FontAwesomeIcon icon={faShield} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
            </div>
        </div>
    );
}
