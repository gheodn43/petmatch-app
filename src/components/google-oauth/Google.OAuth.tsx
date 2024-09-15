'use client'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const GoogleOAuth: React.FC = () => {
    const router = useRouter();

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        jwtDecoder(credentialResponse?.credential);
        router.push('/signup');
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

const jwtDecoder = (token: string | undefined) => {
    if (token) {
        try {
            const decoded = jwt.decode(token);
            console.log(decoded);
        } catch (error) {
            console.error('Failed to decode token', error);
        }
    }
};

export default GoogleOAuth;
