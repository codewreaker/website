import { Component, ErrorInfo, ReactNode } from 'react';
import './error-boundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <RouteErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface RouteErrorProps {
  error?: Error;
}

export const RouteErrorDisplay = ({ error }: RouteErrorProps) => {
  return (
    <div className="error-boundary">
      <div className="error-content">
        <div className="glitch-wrapper">
          <div className="glitch" data-text="Error">Error</div>
        </div>
        <p className="error-message">
          {error?.message || 'Something went wrong'}
        </p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
