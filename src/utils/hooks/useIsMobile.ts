import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint: number = 480) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);
        
        // Check on mount
        checkMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkMobile);
        
        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
