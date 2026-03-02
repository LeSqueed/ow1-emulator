import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Divider, message, Popconfirm, Button, Space, Table, Tag, Tooltip, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import type { Ability, Hero } from '../../types';
import { AbilityFormModal } from './AbilityFormModal';

const { Option } = Select;

function toOpyName(constantName: string): string {
  return constantName
    .split('_')
    .map((part, i) => i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

interface HeroFormModalProps {
  open: boolean;
  editing?: Hero | null;
  onCancel: () => void;
  onSave: () => void;
  /** Called after a new hero is created. Modal stays open; parent should set editing to the new hero. */
  onCreated?: (hero: Hero) => void;
}

export const HeroFormModal: React.FC<HeroFormModalProps> = ({ open, editing, onCancel, onSave, onCreated }) => {
  const { addHero, updateHero, deleteHero, deleteAbility, getHeroAbilities } = useApp();
  const [form] = Form.useForm();
  const autoOpyName = React.useRef('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [heroAbilities, setHeroAbilities] = useState<(Ability & { propertiesCount: number })[]>([]);
  const [showAbilityModal, setShowAbilityModal] = useState(false);
  const [editingAbility, setEditingAbility] = useState<Ability | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        display_name: editing.display_name,
        constant_name: editing.constant_name,
        opy_name: editing.opy_name ?? '',
        role: editing.role,
        enabled: editing.enabled !== false,
        patched_health: editing.patched_health,
        live_health: editing.live_health,
        patched_armor: editing.patched_armor,
        live_armor: editing.live_armor,
        patched_shields: editing.patched_shields,
        live_shields: editing.live_shields,
        patched_ult_cost: editing.patched_ult_cost,
        live_ult_cost: editing.live_ult_cost,
      });
      loadHeroAbilities(editing.id);
    } else {
      autoOpyName.current = '';
      form.resetFields();
      form.setFieldsValue({
        enabled: true,
        patched_health: 200, live_health: 200,
        patched_armor: 0, live_armor: 0,
        patched_shields: 0, live_shields: 0,
        patched_ult_cost: 2000, live_ult_cost: 2000,
      });
      setHeroAbilities([]);
    }
  }, [open, editing, form]);

  const loadHeroAbilities = async (heroId: number) => {
    if (!heroId) return;
    try {
      setHeroAbilities(await getHeroAbilities(heroId));
    } catch (e) {
      message.error('Failed to load abilities');
    }
  };

  const handleDisplayNameChange = (value: string) => {
    if (!editing) {
      const snake = value.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
      form.setFieldValue('constant_name', snake);
      const current = form.getFieldValue('opy_name');
      if (!current || current === autoOpyName.current) {
        const derived = toOpyName(snake);
        autoOpyName.current = derived;
        form.setFieldValue('opy_name', derived);
      }
    }
  };

  const handleConstantNameChange = (value: string) => {
    const current = form.getFieldValue('opy_name');
    if (!editing && (!current || current === autoOpyName.current)) {
      const derived = toOpyName(value);
      autoOpyName.current = derived;
      form.setFieldValue('opy_name', derived);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async (values: any) => {
    try {
      setLoading(true);
      if (editing) {
        await updateHero(editing.id, values);
        onSave();
      } else {
        const { hero } = await addHero(values);
        onCreated?.(hero);
      }
    } catch (e: any) {
      message.error('Failed to save hero: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      setDeleting(true);
      await deleteHero(editing.id);
      form.resetFields();
      onSave();
    } catch (e: any) {
      message.error('Failed to delete hero: ' + (e.message || 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      title={editing ? `Edit ${editing.display_name}` : 'Add New Hero'}
      open={open}
      onOk={() => form.submit()}
      onCancel={() => { form.resetFields(); onCancel(); }}
      okText={editing ? 'Update' : 'Create'}
      confirmLoading={loading}
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item name="display_name" label="Display Name" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="e.g., Ana" onChange={e => handleDisplayNameChange(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="constant_name" label="Constant Name" rules={[{ required: true, message: 'Required' }]} tooltip="snake_case — drives OW1_*/OW2_* constant prefixes">
              <Input placeholder="e.g., ana" onChange={e => handleConstantNameChange(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="opy_name"
              label="OverPy Name"
              tooltip="Canonical OverPy hero identifier for enabledHeroes. Auto-derived from Constant Name if left blank."
            >
              <Input
                placeholder="e.g., wreckingBall"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Required' }]}>
              <Select>
                {['Tank', 'Dps', 'Support'].map(r => <Option key={r} value={r}>{r}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="enabled" label="In Roster" valuePropName="checked" tooltip="Whether this hero appears in the generated enabledHeroes roster">
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left" plain>Stats — OW1 (Patched) / OW2 (Live)</Divider>
        <Row gutter={12}>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#f99e1a' }}>OW1 (Patched)</div>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="patched_health" label="Health">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="patched_armor" label="Armor">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="patched_shields" label="Shields">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="patched_ult_cost" label="Ult Cost">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#8a8070' }}>OW2 (Live)</div>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="live_health" label="Health">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="live_armor" label="Armor">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="live_shields" label="Shields">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="live_ult_cost" label="Ult Cost">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <button type="submit" hidden />
      </Form>

      {editing && (
        <>
          <Divider orientation="left">Abilities ({heroAbilities.length})</Divider>
          <div style={{ marginBottom: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingAbility(null); setShowAbilityModal(true); }}>
              Add Ability
            </Button>
          </div>
          <Table
            dataSource={heroAbilities}
            rowKey="id"
            size="small"
            pagination={false}
            style={{ marginBottom: 8 }}
            columns={[
              {
                title: 'Ability',
                key: 'display_name',
                sorter: (a, b) => a.display_name.localeCompare(b.display_name),
                defaultSortOrder: 'ascend' as const,
                render: (_: unknown, r) => (
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>{r.display_name}</span>
                    <span style={{ fontSize: 11, color: '#8a8070' }}>{r.constant_name}</span>
                  </Space>
                ),
              },
              {
                title: 'Properties',
                key: 'propertiesCount',
                width: 90,
                align: 'center' as const,
                render: (_: unknown, r) => <Tag>{r.propertiesCount ?? 0}</Tag>,
              },
              {
                title: '',
                key: 'actions',
                width: 80,
                render: (_: unknown, r) => (
                  <Space>
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingAbility(r); setShowAbilityModal(true); }} />
                    <Popconfirm
                      title="Delete this ability?"
                      description="This will delete the ability and all its properties."
                      onConfirm={async () => {
                        await deleteAbility(r.id);
                        if (editing) await loadHeroAbilities(editing.id);
                      }}
                      okText="Yes, delete it"
                      cancelText="Cancel"
                    >
                      <Button type="link" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
          <Popconfirm
            title="Delete this hero?"
            description="This will delete the hero and all abilities. This action cannot be undone."
            onConfirm={handleDelete}
            okText="Yes, delete it"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />} loading={deleting} style={{ width: '100%', marginTop: 16 }}>
              Delete Hero
            </Button>
          </Popconfirm>
        </>
      )}

      <AbilityFormModal
        open={showAbilityModal}
        heroId={editing?.id ?? 0}
        editing={editingAbility}
        onCancel={() => { setShowAbilityModal(false); setEditingAbility(null); }}
        onSave={async () => { setShowAbilityModal(false); setEditingAbility(null); if (editing) await loadHeroAbilities(editing.id); }}
      />
    </Modal>
  );
};
