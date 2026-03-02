import React, { useEffect, useState } from 'react';
import TopLoadingBar from '../layouts/components/TopLoadingBar';
import { subscribeLoadingBar } from '../libs/loadingBar';

const LoadingBarProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeLoadingBar(setIsLoading);
        return () => unsubscribe();
    }, []);

    return (
        <>
            <TopLoadingBar isLoading={isLoading} />
            {children}
        </>
    );
};

export default LoadingBarProvider;
