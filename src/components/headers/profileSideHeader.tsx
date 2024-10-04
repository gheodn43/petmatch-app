'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShield } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function ProfileSideHeader() {
    const router = useRouter();

    const handleClickLogo =()=>{
        router.push('/home');
    }
    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-secondary to-yellow-300 h-16 p-4 cursor-pointer">
            <div className="flex items-center space-x-4 rounded-full hover:bg-primary/35 p-1">
                <img src='/images/logo-white.png' className='h-12' onClick={handleClickLogo}/>
            </div>
            <div className='flex items-center space-x-4'>
                <FontAwesomeIcon icon={faComment} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
                <FontAwesomeIcon icon={faShield} className="text-secondary bg-primary p-2 rounded-full responsive-text hover:text-primary hover:bg-secondary" />
            </div>
        </div>
    );
}
