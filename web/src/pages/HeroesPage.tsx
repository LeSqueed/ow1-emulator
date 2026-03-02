import React, { useState } from 'react';
import { Button, Input, Table, Space, Tag, Card, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Hero } from '@/types';
import { useApp } from '@/contexts/AppContext.js';
import { HeroFormModal } from '../components/modals/HeroFormModal';
import { darkModeColors as defaultDarkModeColors, getRoleColor, getHealthTypeColor } from '@/theme/config.js';

/** Convert snake_case constant_name to camelCase OverPy hero identifier. */
function toOpyName(constantName: string): string {
  return constantName
    .split('_')
    .map((part, i) => i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

export const HeroesPage: React.FC = () => {
  const { heroes, loading, deleteHero, updateHero, refresh } = useApp();
  const [search, setSearch] = useState('');
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);

  const darkModeColors = defaultDarkModeColors;
  const secondaryColor = darkModeColors.secondary;
  const cardBg = darkModeColors.cardBg;

  const filteredHeroes = heroes.filter(h =>
    !search ||
    h.display_name.toLowerCase().includes(search.toLowerCase()) ||
    h.constant_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<Hero & { abilitiesCount: number }> = [
    {
      title: 'Hero',
      key: 'display_name',
      width: 180,
      sorter: (a, b) => a.display_name.localeCompare(b.display_name),
      render: (_: unknown, r) => {
        const disabled = r.enabled === false;
        return (
          <Space direction="vertical" size={0} style={{ opacity: disabled ? 0.45 : 1 }}>
            <span style={{ fontWeight: 500, textDecoration: disabled ? 'line-through' : undefined }}>
              {r.display_name}
            </span>
            <Space size={4}>
              <span style={{ fontSize: 11, color: secondaryColor }}>{r.constant_name}</span>
              <Tooltip title="OverPy hero name used in enabledHeroes roster">
                <span style={{ fontSize: 11, color: '#a882e8' }}>
                  → {r.opy_name ?? toOpyName(r.constant_name)}
                </span>
              </Tooltip>
            </Space>
          </Space>
        );
      }
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.role.localeCompare(b.role),
      filters: [
        { text: 'Tank', value: 'Tank' },
        { text: 'DPS', value: 'Dps' },
        { text: 'Support', value: 'Support' },
      ],
      onFilter: (value, r) => r.role === value,
      render: (r: string) => <Tag color={getRoleColor(r)}>{r.toUpperCase()}</Tag>
    },
    {
      title: 'Health',
      dataIndex: 'patched_health',
      key: 'patched_health',
      width: 80,
      align: 'right',
      render: (v: number) => <Tag color={getHealthTypeColor('health')}>{v}</Tag>
    },
    {
      title: 'Armor',
      dataIndex: 'patched_armor',
      key: 'patched_armor',
      width: 70,
      align: 'right',
      render: (v: number) => <Tag color={getHealthTypeColor('armor')}>{v}</Tag>
    },
    {
      title: 'Shields',
      dataIndex: 'patched_shields',
      key: 'patched_shields',
      width: 70,
      align: 'right',
      render: (v: number) => <Tag color={getHealthTypeColor('shields')}>{v}</Tag>
    },
    {
      title: 'Abilities',
      key: 'abilitiesCount',
      width: 90,
      render: (_: unknown, r) => <Tag>{r.abilitiesCount || 0} abilities</Tag>
    },
    {
      title: 'Roster',
      key: 'enabled',
      width: 90,
      align: 'center' as const,
      filters: [
        { text: 'Enabled', value: true },
        { text: 'Disabled', value: false },
      ],
      onFilter: (value, r) => (r.enabled !== false) === value,
      render: (_: unknown, r) => (
        <Tooltip title={r.enabled === false ? 'Enable in roster' : 'Disable in roster'}>
          <Tag
            color={r.enabled === false ? 'default' : 'green'}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => updateHero(r.id, { enabled: r.enabled === false ? true : false })}
          >
            {r.enabled === false ? 'Off' : 'On'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: unknown, r) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingHero(r); setShowHeroModal(true); }} />
          <Popconfirm
            title="Delete this hero?"
            description="This will delete the hero and all abilities. This action cannot be undone."
            onConfirm={async () => { try { await deleteHero(r.id); } catch { message.error('Failed to delete hero'); } }}
            okText="Yes, delete it"
            cancelText="Cancel"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="ow-page">
      <Card style={{ background: cardBg, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Input
            placeholder="Search heroes..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
            allowClear
            disabled={loading}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingHero(null); setShowHeroModal(true); }} disabled={loading}>
            Add Hero
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={filteredHeroes}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Total ${t} heroes` }}
        />
      </Card>
      <HeroFormModal
        open={showHeroModal}
        editing={editingHero}
        onCancel={() => { setShowHeroModal(false); setEditingHero(null); }}
        onSave={() => { setShowHeroModal(false); setEditingHero(null); refresh(); }}
        onCreated={(hero) => { setEditingHero(hero); refresh(); }}
      />
    </div>
  );
};
