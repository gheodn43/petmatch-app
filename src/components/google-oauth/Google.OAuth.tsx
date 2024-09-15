'use client'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const GoogleOAuth: React.FC = () => {
    const router = useRouter();

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        const response = jwtDecoder(credentialResponse?.credential);
        if (response) {
            const data = {
                email: response.email,
                firstName: response.given_name, 
                lastName: response.family_name,
                picture: response.picture,
            };
            console.log(data);
            router.push('/signup');
        } else {
            console.error('Failed to decode token');
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

const jwtDecoder = (token: string | undefined) => {
    if (token) {
        try {
            const decoded = jwt.decode(token);
            console.log(decoded);
            return decoded;
        } catch (error) {
            console.error('Failed to decode token', error);
        }
    }
};

export default GoogleOAuth;
