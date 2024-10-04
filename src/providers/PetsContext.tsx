'use client'
import React, { createContext, useContext, useState } from 'react';
interface HashPetContextType {
    hasPets: boolean;
    setHasPets: React.Dispatch<React.SetStateAction<boolean>>;
}
const PetsContext = createContext<HashPetContextType | null>(null);
export const usePetsContext = () => {
    const context = useContext(PetsContext);
    if (!context) {
        throw new Error("usePetsContext must be used within a PetsProvider");
    }
    return context;
};
export const PetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasPets, setHasPets] = useState<boolean>(true);

    return (
        <PetsContext.Provider value={{ hasPets, setHasPets }}>
            {children}
        </PetsContext.Provider>
    );
};
