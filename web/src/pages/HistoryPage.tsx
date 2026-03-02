import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Table, Space, Tag, Typography, Tooltip, DatePicker } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext.js';
import { darkModeColors as defaultDarkModeColors } from '@/theme/config.js';
import type { Revision } from '@/types';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import 'dayjs/plugin/weekday';
import 'dayjs/plugin/localeData';
import 'dayjs/plugin/weekOfYear';
import 'dayjs/plugin/weekYear';

const { Text } = Typography;

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const getAction = (r: Revision): 'CREATE' | 'DELETE' | 'UPDATE' => {
  if (r.field_name === '__create__') return 'CREATE';
  if (r.field_name === '__delete__') return 'DELETE';
  return 'UPDATE';
};

const ACTION_COLOR: Record<string, string> = {
  CREATE: '#52c41a',
  UPDATE: '#1890ff',
  DELETE: '#ff4d4f',
};

const formatField = (field: string) =>
  field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const HistoryPage: React.FC = () => {
  const { revisions: contextRevisions, heroes, constants, loading: contextLoading, getRevisions } = useApp();
  const darkModeColors = defaultDarkModeColors;
  const textColor = darkModeColors.text;
  const secondaryColor = darkModeColors.secondary;
  const cardBg = darkModeColors.cardBg;

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day').startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [revisions, setRevisions] = useState(contextRevisions);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  useEffect(() => {
    setLoadingRevisions(true);
    getRevisions({ from: dateRange[0].toISOString(), to: dateRange[1].toISOString() })
      .then(setRevisions)
      .finally(() => setLoadingRevisions(false));
  }, [dateRange]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `Total ${total} records`,
    pageSizeOptions: ['5', '10', '15', '25', '50'],
  });

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  // Build name indexes from __create__ revisions so we can resolve names
  // even for deleted entities (the create revision persists in the log).
  const { heroIndex, constantIndex, abilityIndex, propIndex } = useMemo(() => {
    const heroIndex: Record<number, string> = {};
    const constantIndex: Record<number, string> = {};
    const abilityIndex: Record<number, { display_name: string; hero_id: number }> = {};
    const propIndex: Record<number, { name: string; ability_id: number }> = {};

    // Seed from live context first (authoritative for existing records).
    heroes.forEach(h => { heroIndex[h.id] = h.display_name; });
    constants.forEach(c => { constantIndex[c.id] = c.display_name; });

    // Fill gaps from create revisions (catches deleted entities).
    contextRevisions.forEach(r => {
      if (r.field_name !== '__create__') return;
      try {
        const d = JSON.parse(r.new_value || '{}');
        if (r.table_name === 'heroes' && !heroIndex[r.record_id]) {
          heroIndex[r.record_id] = d.display_name;
        } else if (r.table_name === 'constants' && !constantIndex[r.record_id]) {
          constantIndex[r.record_id] = d.display_name;
        } else if (r.table_name === 'abilities') {
          abilityIndex[r.record_id] = { display_name: d.display_name, hero_id: d.hero_id };
        } else if (r.table_name === 'ability_properties') {
          propIndex[r.record_id] = { name: d.name, ability_id: d.ability_id };
        }
      } catch { /* ignore malformed snapshots */ }
    });

    return { heroIndex, constantIndex, abilityIndex, propIndex };
  }, [contextRevisions, heroes, constants]);

  // Returns a primary name and optional subtitle for a revision row.
  const getEntityInfo = (r: Revision): { name: string; subtitle?: string } => {
    switch (r.table_name) {
      case 'heroes':
        return { name: heroIndex[r.record_id] ?? `Hero #${r.record_id}` };

      case 'constants':
        return { name: constantIndex[r.record_id] ?? `Constant #${r.record_id}` };

      case 'abilities': {
        const ability = abilityIndex[r.record_id];
        if (!ability) return { name: `Ability #${r.record_id}` };
        const hero = heroIndex[ability.hero_id] ?? `Hero #${ability.hero_id}`;
        return { name: hero, subtitle: ability.display_name };
      }

      case 'ability_properties': {
        const prop = propIndex[r.record_id];
        if (!prop) return { name: `Property #${r.record_id}` };
        const ability = abilityIndex[prop.ability_id];
        const hero = ability ? (heroIndex[ability.hero_id] ?? `Hero #${ability.hero_id}`) : '';
        const abilityName = ability?.display_name ?? `Ability #${prop.ability_id}`;
        return {
          name: hero || abilityName,
          subtitle: hero ? `${abilityName} › ${prop.name}` : prop.name,
        };
      }

      default:
        return { name: r.table_name };
    }
  };

  // Already sorted by the API (newest first).
  const sortedRevisions = revisions;

  // Group by calendar date for the timeline (newest dates first).
  const { groupedByDate, sortedDates } = useMemo(() => {
    const groupedByDate: Record<string, Revision[]> = {};
    sortedRevisions.forEach(r => {
      const date = new Date(r.updated_at).toLocaleDateString();
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(r);
    });
    const sortedDates = Object.keys(groupedByDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    return { groupedByDate, sortedDates };
  }, [sortedRevisions]);

  const columns = [
    {
      title: 'When',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 110,
      render: (d: string) => (
        <Tooltip title={new Date(d).toLocaleString()}>
          <span style={{ fontSize: 12, color: secondaryColor }}>{relativeTime(d)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Entity',
      key: 'entity',
      width: 210,
      render: (_: unknown, r: Revision) => {
        const { name, subtitle } = getEntityInfo(r);
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 500 }}>{name}</span>
            {subtitle && <span style={{ fontSize: 11, color: secondaryColor }}>{subtitle}</span>}
          </Space>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, r: Revision) => {
        const a = getAction(r);
        return <Tag color={ACTION_COLOR[a]}>{a}</Tag>;
      },
    },
    {
      title: 'Change',
      key: 'change',
      render: (_: unknown, r: Revision) => {
        const action = getAction(r);
        if (action === 'CREATE') return <span style={{ color: '#52c41a', fontSize: 12 }}>Added</span>;
        if (action === 'DELETE') return <span style={{ color: '#ff4d4f', fontSize: 12 }}>Removed</span>;
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontSize: 11, color: secondaryColor }}>{formatField(r.field_name)}</span>
            <span style={{ fontSize: 12 }}>
              <span style={{ color: '#ff4d4f' }}>{r.old_value}</span>
              <span style={{ color: secondaryColor }}> → </span>
              <span style={{ color: '#52c41a' }}>{r.new_value}</span>
            </span>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="ow-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            variant="borderless"
            title="History"
            style={{ background: cardBg, borderRadius: 8 }}
            styles={{ body: { padding: 16 } }}
            extra={
              <DatePicker.RangePicker
                value={dateRange}
                onChange={range => {
                  if (range?.[0] && range?.[1]) {
                    setDateRange([range[0].startOf('day') as unknown as Dayjs, range[1].endOf('day') as unknown as Dayjs]);
                    setPagination(prev => ({ ...prev, current: 1 }));
                    setRevisions([]);
                  }
                }}
                allowClear={false}
                size="small"
              />
            }
          >
            <Table
              loading={contextLoading || loadingRevisions}
              dataSource={sortedRevisions}
              columns={columns}
              rowKey="id"
              pagination={pagination}
              onChange={handleTableChange}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            variant="borderless"
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Timeline
              </div>
            }
            style={{ background: cardBg, borderRadius: 8 }}
            styles={{ body: { padding: 16, maxHeight: 600, overflow: 'auto' } }}
          >
            {sortedDates.map(date => (
              <div key={date} style={{ marginBottom: 16 }}>
                <Text strong style={{ color: textColor, fontSize: 13 }}>{date}</Text>
                <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: `2px solid ${darkModeColors.tableBorderColor}` }}>
                  {groupedByDate[date].map((r, i) => {
                    const { name, subtitle } = getEntityInfo(r);
                    const action = getAction(r);
                    return (
                      <div key={`${r.id}-${i}`} style={{ marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Tag color={ACTION_COLOR[action]} style={{ margin: 0, flexShrink: 0 }}>
                          {action[0]}
                        </Tag>
                        <div style={{ fontSize: 12, lineHeight: '20px' }}>
                          <span>{name}</span>
                          {subtitle && <span style={{ color: secondaryColor }}> · {subtitle}</span>}
                          {action === 'UPDATE' && (
                            <span style={{ color: secondaryColor }}> · {formatField(r.field_name)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
