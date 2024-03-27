import React, { useEffect } from 'react';

const Loading = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <span className="loading loading-spinner loading-lg"></span>
    );
}

export default Loading;