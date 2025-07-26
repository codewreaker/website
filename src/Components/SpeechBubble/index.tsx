import type React from 'react';

interface SpeechBubbleProps {
  children: React.ReactNode;
  direction?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
  color?: string;
}

export function SpeechBubble({
  children,
  direction = 'bottom',
  color = 'var(--color-primary)', // Default color
  className = '',
}: SpeechBubbleProps) {

  const bubbleStyle = {
    backgroundColor: color,
    color: 'white',
    padding: '8px 24px',
    fontSize: '1.1rem',
    fontWeight: '500',
    position: 'relative' as const,
    display: 'inline-block',
  };

  const getArrowStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      width: '0',
      height: '0',
    };

    switch (direction) {
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '-11px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: `12px solid ${color}`,
        };
      case 'top':
        return {
          ...baseStyle,
          top: '-11px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: `12px solid ${color}`,
        };
      case 'left':
        return {
          ...baseStyle,
          left: '-11px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '12px solid transparent',
          borderBottom: '12px solid transparent',
          borderRight: `12px solid ${color}`,
        };
      case 'right':
        return {
          ...baseStyle,
          right: '-11px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '12px solid transparent',
          borderBottom: '12px solid transparent',
          borderLeft: `12px solid ${color}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      className={`speech-bubble ${className}`}
      style={{ position: 'relative', display: 'inline-block', margin: '10px' }}
    >
      <div style={bubbleStyle}>{children}</div>
      <div style={getArrowStyle()}></div>
    </div>
  );
}
