import React from 'react';
import { Alert, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface ErrorAlertProps {
  error: string | null;
  onRetry?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <Alert
      type="error"
      message="Error"
      description={
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>{error}</div>
          {onRetry && (
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={onRetry}
              danger
            >
              Retry
            </Button>
          )}
        </Space>
      }
      showIcon
      closable
      style={{ marginBottom: 16 }}
    />
  );
};

export default ErrorAlert;