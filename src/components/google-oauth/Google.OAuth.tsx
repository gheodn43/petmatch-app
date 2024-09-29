'use client';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { dbPet } from '@/localDB/pet.db';

const GoogleOAuth: React.FC = () => {
    const router = useRouter();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse?.credential) {
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
                    router.push('/home');
                } else {
                    console.error('Login failed', await response.json());
                }
            } catch (error) {
                console.error('Error sending credential', error);
            }
        } else {
            console.error('Credential is required');
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
            text='signin_with'
            shape='pill'
        />
    );
};

export default GoogleOAuth;
