'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-96 w-full p-4">
          <Card className="max-w-md w-full border-destructive/50 bg-destructive/5">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>{this.props.title || 'Something went wrong'}</CardTitle>
              <CardDescription>
                {this.state.error?.message || 'An unexpected error occurred in this component.'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={this.handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  title?: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <AppErrorBoundary title={title}>
        <Component {...props} />
      </AppErrorBoundary>
    );
  };
}
