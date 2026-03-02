import React, { useEffect, useState } from 'react';
import TopLoadingBar from '../layouts/components/TopLoadingBar';
import { subscribeLoadingBar } from '../libs/loadingBar';
import AccessibilityWidget from './AccessibilityWidget';

const LoadingBarProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeLoadingBar(setIsLoading);
        return () => unsubscribe();
    }, []);

    return (
        <>
            <TopLoadingBar isLoading={isLoading} />
            <AccessibilityWidget />
            {children}
        </>
    );
};

export default LoadingBarProvider;
