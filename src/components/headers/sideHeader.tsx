'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShield } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@/providers/UserContext';

export default function SideHeader() {
    const user = useUser();
    console.log(user.user_image)
    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-secondary to-yellow-300 h-16 p-4 cursor-pointer">
            <div className="flex items-center space-x-4 rounded-full hover:bg-primary/35 py-1 pl-1 pr-4">
                <img
                    src={user.user_image}
                    alt={`${user.user_name}'s avatar`}
                    className="h-10 w-10 rounded-full"/>
                <span className="responsive-text text-white font-bold">{user.user_name}</span>
            </div>
            <div className='flex items-center space-x-4'>
                <FontAwesomeIcon icon={faComment} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
                <FontAwesomeIcon icon={faShield} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
            </div>
        </div>
    );
}
