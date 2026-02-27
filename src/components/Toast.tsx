import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    show: boolean;
    onHide: () => void;
    duration?: number;
}

export default function Toast({ message, show, onHide, duration = 2000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            // eslint-disable-next-line
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onHide, 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [show, duration, onHide]);

    if (!show && !isVisible) return null;

    return (
        <div className={`toast ${isVisible ? 'show' : ''}`}>
            <span className="toast-icon">✓</span>
            {message}
        </div>
    );
}
