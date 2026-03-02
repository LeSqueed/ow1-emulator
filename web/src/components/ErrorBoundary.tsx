import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Card, Typography } from 'antd';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card style={{ margin: '24px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <Alert
            message="Something went wrong"
            description="An error occurred in this component."
            type="error"
            showIcon
          />
          <div style={{ marginTop: '16px' }}>
            <Typography.Title level={5}>Error Details</Typography.Title>
            <Typography.Paragraph>
              <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '200px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                {this.state.error?.toString()}
              </pre>
            </Typography.Paragraph>
            {this.state.errorInfo && (
              <Typography.Paragraph>
                <Typography.Text strong>Component Stack:</Typography.Text>
                <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '200px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </Typography.Paragraph>
            )}
          </div>
          <Button type="primary" onClick={this.handleReset} style={{ marginTop: '16px' }}>
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;