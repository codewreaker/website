import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProgressStep<T = any> {
  name: string;
  action: () => Promise<T>;
}

export interface UseProgressLoaderOptions<T = any> {
  steps: ProgressStep<T>[];
  onComplete?: (results: T, state: ProgressLoaderState) => void;
  onStep?: (index: number, step: ProgressStep<T>, result: T) => void;
  autoStart?: boolean;
  delay?: number; // Delay between steps for visual feedback
}

export interface ProgressLoaderState {
  progress: number;
  currentStepIndex: number;
  isLoading: boolean;
  currentStep: ProgressStep | null;
  error: Error | null;
  results: any[];
}

const useProgressLoader = <T = any>({
  steps,
  onComplete,
  onStep,
  autoStart = true,
  delay = 150,
}: UseProgressLoaderOptions<T>) => {
  const [state, setState] = useState<ProgressLoaderState>({
    progress: 0,
    currentStepIndex: 0,
    isLoading: false,
    currentStep: null,
    error: null,
    results: [],
  });

  // Use ref to prevent re-execution on re-renders
  const isExecutingRef = useRef(false);
  const hasExecutedRef = useRef(false);

  const executeSteps = useCallback(async () => {
    if (
      steps.length === 0 ||
      isExecutingRef.current ||
      hasExecutedRef.current
    ) {
      return;
    }

    steps.push({name: 'Done',action: () => Promise.resolve({} as T)});

    isExecutingRef.current = true;
    hasExecutedRef.current = true;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      progress: 0,
      currentStepIndex: 0,
      error: null,
      results: [],
      currentStep: steps[0] || null,
    }));

    const results: T[] = [];

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        setState((prev) => ({
          ...prev,
          currentStepIndex: i,
          currentStep: step,
        }));

        try {
          const result = await step.action();
          results.push(result);

          // Call onStep callback
          onStep?.(i, step, result);

          // Update progress
          const newProgress = ((i + 1) / steps.length) * 100;
          setState((prev) => ({
            ...prev,
            progress: newProgress,
            results: [...results],
          }));

          // Small delay for visual feedback
          if (delay > 0 && i < steps.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        } catch (stepError) {
          const error =
            stepError instanceof Error
              ? stepError
              : new Error(String(stepError));
          console.error(`Step ${i + 1} failed:`, error);
          results.push(null as T);
        }
      }

      // Complete
      setState((prev) => ({
        ...prev,
        isLoading: false,
        results,
      }));

      // Call onComplete callback
      onComplete?.(results as T, state);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({
        ...prev,
        error: err,
        isLoading: false,
      }));
    } finally {
      isExecutingRef.current = false;
    }
  }, [steps, onComplete, onStep, delay]);

  // Reset function to allow re-execution
  const reset = useCallback(() => {
    hasExecutedRef.current = false;
    isExecutingRef.current = false;
    setState({
      progress: 0,
      currentStepIndex: 0,
      isLoading: false,
      currentStep: null,
      error: null,
      results: [],
    });
  }, []);

  // Manual start function
  const start = useCallback(() => {
    if (!isExecutingRef.current) {
      hasExecutedRef.current = false;
      executeSteps();
    }
  }, [executeSteps]);

  useEffect(() => {
    if (autoStart && steps.length > 0 && !hasExecutedRef.current) {
      executeSteps();
    }
  }, [executeSteps, autoStart, steps]);

  return {
    ...state,
    start,
    reset,
    isExecuting: isExecutingRef.current,
  };
};

export default useProgressLoader;
