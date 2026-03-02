import React, { useEffect, useRef, useState } from 'react';
import './TopLoadingBar.css';

const TopLoadingBar = ({ isLoading }) => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const intervalRef = useRef(null);
    const finishTimeout = useRef(null);

    useEffect(() => {
        clearInterval(intervalRef.current);
        clearTimeout(finishTimeout.current);

        if (isLoading) {
            setVisible(true);
            setProgress((prev) => (prev > 60 ? prev : 20));

            intervalRef.current = window.setInterval(() => {
                setProgress((prev) => Math.min(prev + Math.random() * 10, 90));
            }, 220);
        } else if (visible) {
            setProgress(100);
            finishTimeout.current = window.setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 400);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(finishTimeout.current);
        };
    }, [isLoading, visible]);

    return (
        <div className={`top-loading-bar ${visible ? 'visible' : ''}`}>
            <div className="top-loading-bar__progress" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default TopLoadingBar;
