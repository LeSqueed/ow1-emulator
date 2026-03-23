import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Divider, message, Button, Popconfirm, Table, Space, Tag, Tooltip } from 'antd';
import { darkModeColors } from '../../theme/config';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import type { Ability, AbilityProperty } from '../../types';
import { PropertyFormModal } from './PropertyFormModal';

interface AbilityFormModalProps {
  open: boolean;
  heroId: number;
  editing?: Ability | null;
  onCancel: () => void;
  onSave: () => void;
}

export const AbilityFormModal: React.FC<AbilityFormModalProps> = ({ open, heroId, editing, onCancel, onSave }) => {
  const { addAbility, updateAbility, deleteAbility, getAbilityProperties, deleteProperty, updateProperty, heroes } = useApp();
  const heroName = heroes.find(h => h.id === heroId)?.display_name ?? '';
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<AbilityProperty | null>(null);
  const [properties, setProperties] = useState<AbilityProperty[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({ display_name: editing.display_name, constant_name: editing.constant_name });
      loadProperties(editing.id);
    } else {
      form.resetFields();
      setProperties([]);
    }
  }, [open, editing, form]);

  const loadProperties = async (abilityId: number) => {
    try {
      setLoadingProperties(true);
      setProperties(await getAbilityProperties(abilityId));
    } catch (e) {
      message.error('Failed to load properties');
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleDisplayNameChange = (value: string) => {
    if (!editing) {
      form.setFieldValue('constant_name', value.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, ''));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async (values: any) => {
    try {
      setLoading(true);
      if (editing) {
        await updateAbility(editing.id, values);
      } else {
        await addAbility(heroId, values);
      }
      form.resetFields();
      onSave();
    } catch (e: any) {
      message.error('Failed to save ability: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      await deleteAbility(editing.id);
      onSave();
    } catch (e: any) {
      message.error('Failed to delete ability: ' + (e.message || 'Unknown error'));
    }
  };

  const renderValue = (v: number | string, r: AbilityProperty, side: 'ow1' | 'ow2') => {
    const disabled = r.enabled === false;
    const inactive = (r.file === 'ow1' && side === 'ow2') || (r.file === 'ow2' && side === 'ow1')
      || (r.value_type === 'workshop_setting' && side === 'ow2');

    if (inactive) {
      return <span style={{ color: darkModeColors.tableBorderColor, userSelect: 'none' }}>—</span>;
    }

    if (r.value_type === 'workshop_setting') {
      const hasRange = r.ws_min !== undefined && r.ws_max !== undefined;
      const rangeText = hasRange ? `${r.ws_min} – ${r.ws_max}` : (r.ws_setting_type ?? 'ws');
      const tooltip = [
        r.ws_setting_type,
        hasRange ? `range: ${r.ws_min} – ${r.ws_max}` : null,
        r.ws_category ? `category: ${r.ws_category}` : null,
      ].filter(Boolean).join(' · ');
      return (
        <Tooltip title={tooltip || undefined}>
          <code style={{ background: darkModeColors.codeBg, color: disabled ? '#3a3028' : '#a882e8', padding: '2px 8px', borderRadius: 4, cursor: tooltip ? 'help' : undefined }}>
            {rangeText}
          </code>
        </Tooltip>
      );
    }

    return (
      <code style={{ background: darkModeColors.codeBg, color: disabled ? '#3a3028' : darkModeColors.codeColor, padding: '2px 8px', borderRadius: 4 }}>
        {typeof v === 'number' ? v.toFixed(2) : v}
      </code>
    );
  };

  const toggleEnabled = async (r: AbilityProperty) => {
    await updateProperty(r.id, { enabled: r.enabled === false ? true : false });
    if (editing) await loadProperties(editing.id);
  };

  const propertyColumns = [
    {
      title: 'Name',
      key: 'name',
      sorter: (a: AbilityProperty, b: AbilityProperty) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend' as const,
      render: (_: unknown, r: AbilityProperty) => {
        const disabled = r.enabled === false;
        return (
          <Space size={4} style={{ opacity: disabled ? 0.45 : 1 }}>
            <span style={{ textDecoration: disabled ? 'line-through' : undefined }}>{r.name}</span>
            {r.file === 'ow1' && <Tag color="orange" style={{ fontSize: 10, padding: '0 4px' }}>OW1</Tag>}
            {r.file === 'ow2' && <Tag color="geekblue" style={{ fontSize: 10, padding: '0 4px' }}>OW2</Tag>}
            {r.value_type === 'workshop_setting' && <Tag color="purple" style={{ fontSize: 10, padding: '0 4px' }}>ws</Tag>}
          </Space>
        );
      }
    },
    {
      title: 'OW1 (Patched)',
      dataIndex: 'patched_value',
      key: 'patched_value',
      align: 'right' as const,
      render: (v: number | string, r: AbilityProperty) => renderValue(v, r, 'ow1'),
    },
    {
      title: 'OW2 (Live)',
      dataIndex: 'live_value',
      key: 'live_value',
      align: 'right' as const,
      render: (v: number | string, r: AbilityProperty) => renderValue(v, r, 'ow2'),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, r: AbilityProperty) => (
        <Space>
          <Tooltip title={r.enabled === false ? 'Enable' : 'Disable'}>
            <Button
              type="link"
              size="small"
              icon={r.enabled === false ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => toggleEnabled(r)}
            />
          </Tooltip>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingProperty(r); setShowPropertyForm(true); }} />
          <Popconfirm
            title="Delete this property?"
            onConfirm={async () => {
              await deleteProperty(r.id);
              if (editing) await loadProperties(editing.id);
            }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title={editing ? `Edit ${editing.display_name}` : 'Add New Ability'}
        open={open}
        onOk={() => form.submit()}
        onCancel={() => { form.resetFields(); onCancel(); }}
        okText={editing ? 'Update' : 'Create'}
        confirmLoading={loading}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="display_name" label="Display Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Biotic Grenade" onChange={e => handleDisplayNameChange(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="constant_name" label="Constant Name" rules={[{ required: true, message: 'Required' }]} tooltip="lowercase_snake_case">
                <Input placeholder="e.g., biotic_grenade" />
              </Form.Item>
            </Col>
          </Row>
          <button type="submit" hidden />
        </Form>

        {editing && (
          <>
            <Divider orientation="left">Properties ({properties.length})</Divider>
            <div style={{ marginBottom: 12 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProperty(null); setShowPropertyForm(true); }}>
                Add Property
              </Button>
            </div>
            <Table
          showSorterTooltip={false}
              loading={loadingProperties}
              dataSource={properties}
              columns={propertyColumns}
              rowKey="id"
              pagination={false}
              size="small"
              style={{ marginBottom: 16 }}
            />
            <Popconfirm
              title="Delete this ability?"
              description="This will delete the ability and all its properties."
              onConfirm={handleDelete}
              okText="Yes, delete it"
              cancelText="Cancel"
            >
              <Button danger icon={<DeleteOutlined />} style={{ width: '100%', marginTop: 8 }}>
                Delete Ability
              </Button>
            </Popconfirm>
          </>
        )}
      </Modal>

      <PropertyFormModal
        open={showPropertyForm}
        abilityId={editing?.id ?? 0}
        editing={editingProperty}
        heroName={heroName}
        onCancel={() => { setShowPropertyForm(false); setEditingProperty(null); }}
        onSave={() => {
          setShowPropertyForm(false);
          setEditingProperty(null);
          if (editing) loadProperties(editing.id);
        }}
      />
    </>
  );
};
