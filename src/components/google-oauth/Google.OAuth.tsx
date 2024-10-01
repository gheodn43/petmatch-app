'use client';
import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { dbPet } from '@/localDB/pet.db';

const GoogleOAuth: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // State để theo dõi trạng thái loading

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse?.credential) {
            setIsLoading(true); // Bắt đầu hiển thị loading
            try {
                await dbPet.pet.clear();
                await dbPet.matched.clear();
                await dbPet.selected.clear();

                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ credential: credentialResponse.credential }),
                });

                if (response.ok) {
                    // Chuyển hướng ngay lập tức, nhưng vẫn giữ loading trong vài giây
                    setTimeout(() => {
                        setIsLoading(false); // Tắt loading sau khoảng thời gian delay
                    }, 2000); // Thời gian delay 2 giây

                    router.push('/home');
                } else {
                    console.error('Login failed', await response.json());
                    setIsLoading(false); // Tắt loading nếu có lỗi
                }
            } catch (error) {
                console.error('Error sending credential', error);
                setIsLoading(false); // Tắt loading nếu có lỗi
            }
        } else {
            console.error('Credential is required');
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-custom-gradient">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-72 h-72  bg-white bg-opacity-20 rounded-full animate-pulse-custom"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full animate-pulse-custom"></div>
                        </div>
                        <div className=" p-10 animate-pulse-custom">
                            <img src="/images/logo-color.png" className="w-56" />
                        </div>
                    </div>
                </div>
            ) : (
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    text='signin_with'
                    shape='pill'
                />
            )}
        </>
    );
};

export default GoogleOAuth;
