// src/contexts/ErrorContext.jsx
import { createContext, useState } from 'react';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [isErrorPopUpOpen, setIsErrorPopUpOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleError = (message) => {
        setErrorMessage(message);
        setIsErrorPopUpOpen(true);
        setIsError(true)
    };

    const handleInfo = (message) => {
        setErrorMessage(message);
        setIsErrorPopUpOpen(true);
        setIsError(false);
    };

    const handleCloseErrorPopUp = () => {
        setIsErrorPopUpOpen(false);
        setErrorMessage('');
        setIsError(false)
    };

    return (
        <ErrorContext.Provider value={{ isErrorPopUpOpen, errorMessage, handleError, handleInfo, handleCloseErrorPopUp, isError }}>
            {children}
        </ErrorContext.Provider>
    );
};
