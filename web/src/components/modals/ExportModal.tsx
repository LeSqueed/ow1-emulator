import React, { useEffect, useState } from 'react';
import { Modal, Alert, Tabs, Typography, Button, message } from 'antd';
import { useApp } from '../../contexts/AppContext';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ExportModalProps {
  open: boolean;
  onCancel: () => void;
  generatedFiles?: { files: string[]; content: string[] } | null;
  error?: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onCancel,
  generatedFiles,
  error
}) => {
  const { setExportModalOpen, setExportError } = useApp();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setExportModalOpen(false);
      setExportError(null);
      setCopiedIndex(null);
    }
  }, [open, setExportModalOpen, setExportError]);
  
  const handleCopyContent = (content: string, index: number) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedIndex(index);
        message.success('Content copied to clipboard');
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(() => {
        message.error('Failed to copy content');
      });
  };

  if (!open) return null;

  return (
    <Modal
      title="Generated Files"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {error && (
        <Alert
          type="error"
          message="Export Error"
          description={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {generatedFiles && generatedFiles.files.length > 0 && (
        <>
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            Generated {generatedFiles.files.length} file(s)
          </Text>
          <Tabs
            items={generatedFiles.files.map((file, idx) => ({
              key: String(idx),
              label: file.split('/').pop() || 'Unknown',
              children: (
                <div style={{ position: 'relative' }}>
                  <Button
                    type="text"
                    icon={copiedIndex === idx ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={() => handleCopyContent(generatedFiles.content[idx] || '', idx)}
                    style={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      zIndex: 2,
                      background: '#1c1810',
                      borderRadius: 3
                    }}
                  />
                  <pre
                    style={{
                      background: '#0e0e12',
                      padding: 12,
                      borderRadius: 4,
                      maxHeight: 400,
                      overflow: 'auto',
                      fontSize: 12
                    }}
                  >
                    {generatedFiles.content[idx] || '(empty)'}
                  </pre>
                </div>
              )
            }))}
          />
        </>
      )}
    </Modal>
  );
};