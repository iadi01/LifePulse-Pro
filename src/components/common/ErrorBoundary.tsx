import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6">
            An unexpected error occurred while visualizing this dataset. We have caught it safely without interrupting the entire dashboard.
          </p>
          <Button variant="indigo" onClick={this.handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Application
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
