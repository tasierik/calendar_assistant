import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );
    const [userDetails, setUserDetails] = useState(() => {
        try {
            const storedData = localStorage.getItem("userDetails");
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error("Failed to parse userDetails from localStorage:", error);
            return null;
        }
    });

    const login = (userData) => {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userDetails", JSON.stringify(userData));
        setIsAuthenticated(true);
        setUserDetails(userData)
    };

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userDetails");
        setIsAuthenticated(false);
        setUserDetails(null);
    };

    const value = {
        isAuthenticated,
        userDetails,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
