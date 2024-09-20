import React, { createContext, useContext, useState, useEffect } from 'react';

type UserInfor = {
    user_role: string;
    user_name: string;
    user_image: string;
};

const defaultUserInfo: UserInfor = {
    user_role: 'free',
    user_name: '',
    user_image: 'images/default-avatar.jpg',
};

const UserContext = createContext<UserInfor>(defaultUserInfo);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userInfor, setUserInfor] = useState<UserInfor>(defaultUserInfo);

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

    return <UserContext.Provider value={userInfor}>{children}</UserContext.Provider>;
};
