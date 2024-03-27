import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider.jsx';

const ProtectedComponent = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        const savedIsAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (!savedIsAuthenticated) {
            return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default ProtectedComponent;
