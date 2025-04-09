"use client"
import { useState, useEffect } from "react";

type WindowSize = {
    width: number;
    height: number;
};

const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        // SSR-safe
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize(); // Ініціалізація

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};

export default useWindowSize;
