'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tạo interface cho context
interface HomeContextType {
    homeActiveView: 'main' | 'side';
    setHomeActiveView: (view: 'main' | 'side') => void;
}

// Tạo context
const HomeContext = createContext<HomeContextType | undefined>(undefined);

// Tạo provider
export const HomeProvider = ({ children }: { children: ReactNode }) => {
    const [homeActiveView, setHomeActiveView] = useState<'main' | 'side'>('main');

    return (
        <HomeContext.Provider value={{ homeActiveView, setHomeActiveView }}>
            {children}
        </HomeContext.Provider>
    );
};

// Hook để sử dụng context
export const useHomeContext = () => {
    const context = useContext(HomeContext);
    if (context === undefined) {
        throw new Error('useHomeContext must be used within a HomeProvider');
    }
    return context;
};
