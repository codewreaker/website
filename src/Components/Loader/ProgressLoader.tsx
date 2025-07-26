import React from 'react';
import { ProgressLoaderState } from './useProgressLoader.js';

export interface ProgressLoaderProps {
  state: ProgressLoaderState;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  subtitle?: string;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  state,
  className = '',
  style = {},
  title = 'Loading',
  subtitle,
}) => {
  const { progress, currentStep, isLoading } = state;

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--color-bg, #0e0e11)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: 'var(--font-inter, Inter, system-ui)',
        ...style,
      }}
    >
      {/* CSS Variables */}
      <style>{`        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>

      {/* Loading Content */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          padding: '0 2rem',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: '6.6rem',
            fontWeight: 100,
            margin: '0 0 0.5rem 0',
            background: 'var(--color-primary-two)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        {/* Progress Bar Container */}
        <div
          style={{
            background: 'var(--color-bg-dark)',
            padding: '6px',
            marginBottom: '2rem',
            border:
              '1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Progress Bar */}
          <div
            style={{
              height: '1px',
              background:
                'linear-gradient(90deg, var(--color-primary) 0%, var(--color-grizzly-red) 50%, var(--color-primary) 100%)',
              borderRadius: '8px',
              width: `${progress}%`,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow:
                progress > 0 ? '0 0 20px var(--color-shadow-strong)' : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated shine effect */}
            {progress > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shine 2s infinite',
                }}
              />
            )}
          </div>
        </div>

        {/* Progress Text */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              color: 'var(--color-primary)',
              fontSize: '0.8rem',
              fontWeight: '600',
            }}
          >
            {Math.round(progress)}%
          </span>
          <span
            style={{
              color: 'var(--color-text)',
              fontSize: '0.8rem',
            }}
          >
            {currentStep?.name || 'Initializing...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressLoader;
