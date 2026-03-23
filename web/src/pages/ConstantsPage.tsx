import React, { useState } from 'react';
import { Button, Input, Table, Space, Card, Popconfirm, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Constant } from '@/types';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, LinkOutlined, ToolOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';
import { darkModeColors as defaultDarkModeColors } from '@/theme/config';
import { ConstantFormModal } from '@/components/modals/ConstantFormModal';

export const ConstantsPage: React.FC = () => {
  const { constants, loading, deleteConstant, updateConstant } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingConstant, setEditingConstant] = useState<Constant | null>(null);

  const darkModeColors = defaultDarkModeColors;
  const textColor = darkModeColors.text;
  const secondaryColor = darkModeColors.secondary;
  const cardBg = darkModeColors.cardBg;

  const filteredConstants = constants.filter(c =>
    !search ||
    c.display_name.toLowerCase().includes(search.toLowerCase()) ||
    c.constant_name.toLowerCase().includes(search.toLowerCase())
  );

  const fileScopeBadge = (r: Constant) => {
    if (r.shared) return null;
    const scope = r.file ?? 'both';
    if (scope === 'ow1') return <Tag color="orange" style={{ fontSize: 10, padding: '0 4px' }}>OW1</Tag>;
    if (scope === 'ow2') return <Tag color="geekblue" style={{ fontSize: 10, padding: '0 4px' }}>OW2</Tag>;
    return null;
  };

  const columns: ColumnsType<Constant> = [
    {
      title: 'Name',
      key: 'display_name',
      width: 280,
      render: (_: unknown, r: Constant) => {
        const disabled = r.enabled === false;
        return (
          <Space direction="vertical" size={0} style={{ opacity: disabled ? 0.45 : 1 }}>
            <Space size={6}>
              <span style={{ fontWeight: 500, textDecoration: disabled ? 'line-through' : undefined }}>{r.display_name}</span>
              {r.shared && (
                <Tooltip title="Shared — emitted in both OW1 and OW2 files">
                  <Tag icon={<LinkOutlined />} color="blue" style={{ fontSize: 10, padding: '0 4px' }}>shared</Tag>
                </Tooltip>
              )}
              {fileScopeBadge(r)}
              {r.value_type === 'workshop_setting' && (
                <Tooltip title="Workshop setting — emits a globalvar declaration">
                  <Tag icon={<ToolOutlined />} color="purple" style={{ fontSize: 10, padding: '0 4px' }}>ws</Tag>
                </Tooltip>
              )}
              {disabled && <Tag style={{ fontSize: 10, padding: '0 4px' }}>disabled</Tag>}
            </Space>
            <span style={{ fontSize: 11, color: secondaryColor }}>{r.constant_name}</span>
          </Space>
        );
      }
    },
    {
      title: 'Patched (OW1)',
      dataIndex: 'patched_value',
      key: 'patched_value',
      width: 130,
      align: 'right',
      render: (v: number, r: Constant) => (
        <code style={{ background: darkModeColors.codeBg, color: r.enabled === false ? '#3a3028' : darkModeColors.codeColor, padding: '2px 8px', borderRadius: 4 }}>
          {v}
        </code>
      )
    },
    {
      title: 'Live (OW2)',
      dataIndex: 'live_value',
      key: 'live_value',
      width: 110,
      align: 'right',
      render: (v: number, r: Constant) => (
        <code style={{ background: darkModeColors.codeBg, color: r.enabled === false ? '#3a3028' : darkModeColors.codeColor, padding: '2px 8px', borderRadius: 4 }}>
          {v}
        </code>
      )
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: unknown, r: Constant) => (
        <Space>
          <Tooltip title={r.enabled === false ? 'Enable' : 'Disable'}>
            <Button
              type="link"
              size="small"
              icon={r.enabled === false ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => updateConstant(r.id, { enabled: r.enabled === false ? true : false })}
            />
          </Tooltip>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingConstant(r); setShowModal(true); }} />
          <Popconfirm title="Delete this constant?" onConfirm={() => deleteConstant(r.id)}>
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
            placeholder="Search constants..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
            disabled={loading}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingConstant(null); setShowModal(true); }} disabled={loading}>
            Add Constant
          </Button>
        </div>
        <Table
          showSorterTooltip={false}
          loading={loading}
          dataSource={filteredConstants}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Total ${t} constants` }}
        />
      </Card>
      <ConstantFormModal
        open={showModal}
        editing={editingConstant}
        onCancel={() => { setShowModal(false); setEditingConstant(null); }}
        onSave={() => { setShowModal(false); setEditingConstant(null); }}
      />
    </div>
  );
};
