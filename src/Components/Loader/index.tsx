//@ts-nocheck

import { useState, useEffect } from 'react';

const ProgressLoader = ({ 
  steps = [], 
  onComplete = () => {}, 
  onStep = () => {},
  className = '',
  style = {}
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const executeSteps = async () => {
    if (steps.length === 0) return;
    
    setIsLoading(true);
    setProgress(0);
    setCurrentStepIndex(0);
    setIsComplete(false);
    
    const results = [];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      
      try {
        const result = await steps[i].action();
        results.push(result);
        
        // Call onStep callback
        onStep(i, steps[i], result);
        
        // Update progress
        const newProgress = ((i + 1) / steps.length) * 100;
        setProgress(newProgress);
        
        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        console.error(`Step ${i + 1} failed:`, error);
        results.push(null);
      }
    }
    
    // Complete
    setIsComplete(true);
    setIsLoading(false);
    
    // Call onComplete callback
    onComplete(results);
  };

  useEffect(() => {
    if (steps.length > 0) {
      executeSteps();
    }
  }, [steps]);

  const currentStep = steps[currentStepIndex];

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
        ...style
      }}
    >
      {/* CSS Variables */}
      <style>{`
        :root {
          --color-bg: #0e0e11;
          --color-primary-grey: #232329;
          --color-primary: #ff6a1a;
          --color-primary-two: #9f2b00;
          --color-grizzly-red: #ef474a;
          --color-bg-dark: color-mix(in srgb, var(--color-bg) 90%, black);
          --color-text: #fff;
          --color-text-secondary: #d3d3cb;
          --color-shadow-strong: color-mix(in srgb, var(--color-primary) 18%, transparent);
          --color-bg-gradient: linear-gradient(135deg, color-mix(in srgb, var(--color-bg) 95%, white) 60%, var(--color-primary) 100%);
        }
        
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
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        padding: '0 2rem'
      }}>
        {/* Title */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            background: 'var(--color-bg-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Loading
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1.1rem',
            margin: 0
          }}>
            {isComplete ? 'Complete!' : 'Please wait...'}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div style={{
          background: 'var(--color-bg-dark)',
          borderRadius: '12px',
          padding: '6px',
          marginBottom: '2rem',
          border: '1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Progress Bar */}
          <div style={{
            height: '12px',
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-grizzly-red) 50%, var(--color-primary) 100%)',
            borderRadius: '8px',
            width: `${progress}%`,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: progress > 0 ? '0 0 20px var(--color-shadow-strong)' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated shine effect */}
            {progress > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shine 2s infinite',
              }} />
            )}
          </div>
        </div>

        {/* Progress Text */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <span style={{
            color: 'var(--color-text)',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {Math.round(progress)}%
          </span>
          <span style={{
            color: 'var(--color-text-secondary)',
            fontSize: '0.95rem'
          }}>
            {currentStep?.name || 'Initializing...'}
          </span>
        </div>

        {/* Loading Animation */}
        {!isComplete && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4px'
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressLoader;