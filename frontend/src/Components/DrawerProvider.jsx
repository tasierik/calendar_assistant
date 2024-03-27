import React, { useState, createContext } from 'react';

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
            {children}
        </DrawerContext.Provider>
    );
};