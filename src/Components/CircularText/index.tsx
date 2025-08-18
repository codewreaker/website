import React, { ReactNode, useState, useEffect, useRef } from 'react';
import './circular-text.css';

interface CircularTextProps {
    text: string;
    children: ReactNode;
    className?: string;
    scale?: number;
    animate?: boolean;
}

const CircularText: React.FC<CircularTextProps> = ({ 
    text, 
    children, 
    className = '',
    scale = 1.2,
    animate = true
}) => {
    const [rotation, setRotation] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const animationRef = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!animate) return; // Don't start animation if animate is false

        const animateFrame = (time: number) => {
            if (!lastTimeRef.current) {
                lastTimeRef.current = time;
            }

            const deltaTime = time - lastTimeRef.current;
            if (!isHovered) {
                // Rotate 18 degrees per second (full rotation in 20 seconds)
                setRotation(prev => (prev + (deltaTime * 0.018)) % 360);
            }
            lastTimeRef.current = time;
            animationRef.current = requestAnimationFrame(animateFrame);
        };

        animationRef.current = requestAnimationFrame(animateFrame);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isHovered, animate]);

    return (
        <div 
            className={`circular-wrapper ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div 
                className="circular-text"
                style={{
                    width: `${scale * 100}%`,
                    height: `${scale * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
            >
                {text.split('').map((char, i) => (
                    <span
                        key={i}
                        style={{
                            transform: `rotate(${i * (360 / text.length)}deg)`,
                            fontSize: `${scale}em`
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>
            <div className="circular-content">
                {children}
            </div>
        </div>
    );
};

export default CircularText;
