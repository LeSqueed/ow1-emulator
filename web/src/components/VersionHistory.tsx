import React from 'react';
import { Timeline, Card, Tag, Typography, Space } from 'antd';
import type { Revision } from '../types';

const { Text, Title } = Typography;

interface VersionHistoryProps {
  revisions: Revision[];
  loading: boolean;
}

const getAction = (r: Revision) => {
  if (r.field_name === '__create__') return 'CREATE';
  if (r.field_name === '__delete__') return 'DELETE';
  return 'UPDATE';
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE': return 'success';
    case 'UPDATE': return 'processing';
    case 'DELETE': return 'error';
    default: return 'default';
  }
};

const VersionHistory: React.FC<VersionHistoryProps> = ({ revisions, loading }) => {
  const groupedRevisions = revisions.reduce((acc, revision) => {
    const date = new Date(revision.updated_at).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(revision);
    return acc;
  }, {} as Record<string, Revision[]>);

  const sortedDates = Object.keys(groupedRevisions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Card variant="borderless" loading={loading}>
      <Title level={4}>Version Timeline</Title>
      <Timeline>
        {sortedDates.map((date) => (
          <Timeline.Item key={date} color="blue">
            <div style={{ marginBottom: 16 }}>
              <Text strong>{date}</Text>
              {groupedRevisions[date].map((revision, index) => {
                const action = getAction(revision);
                return (
                  <Card key={`${revision.id}-${index}`} size="small" style={{ marginTop: 8, marginBottom: 8 }}>
                    <Space direction="vertical" size={4}>
                      <Space>
                        <Text strong>{revision.table_name}</Text>
                        <Tag color={getActionColor(action)}>{action}</Tag>
                        <Text type="secondary">{new Date(revision.updated_at).toLocaleTimeString()}</Text>
                      </Space>
                      {action === 'UPDATE' && (
                        <Text type="secondary" style={{ fontSize: 12 }}>{revision.field_name}: {revision.old_value} → {revision.new_value}</Text>
                      )}
                    </Space>
                  </Card>
                );
              })}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

export default VersionHistory;
