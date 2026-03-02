import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Row, Col, Segmented, Switch, Select, Divider } from 'antd';
import { useApp } from '../../contexts/AppContext';
import type { AbilityProperty, FileScope, ValueType } from '../../types';

interface PropertyFormModalProps {
  open: boolean;
  abilityId: number;
  editing?: AbilityProperty | null;
  onCancel: () => void;
  onSave: () => void;
  heroName?: string;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ open, abilityId, editing, onCancel, onSave, heroName }) => {
  const { addProperty, updateProperty } = useApp();
  const [form] = Form.useForm();
  const [valueType, setValueType] = useState<ValueType>('number');
  const [fileScope, setFileScope] = useState<FileScope>('both');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const vt = editing.value_type ?? 'number';
      const fs = editing.file ?? 'both';
      setValueType(vt);
      setFileScope(vt === 'workshop_setting' ? 'ow1' : fs);
      form.setFieldsValue({
        name: editing.name,
        patched_value: editing.patched_value,
        live_value: editing.live_value,
        value_type: vt,
        enabled: editing.enabled ?? true,
        file: editing.file ?? 'both',
        ws_category: editing.ws_category,
        ws_label: editing.ws_label,
        ws_setting_type: editing.ws_setting_type ?? 'float',
        ws_min: editing.ws_min,
        ws_max: editing.ws_max,
      });
    } else {
      form.resetFields();
      setValueType('number');
      setFileScope('both');
      form.setFieldsValue({
        patched_value: 0,
        live_value: 0,
        value_type: 'number',
        enabled: true,
        file: 'both',
        ws_setting_type: 'float',
      });
    }
  }, [open, editing, form]);

  const applyWsDefaults = () => {
    const currentName = form.getFieldValue('name') as string | undefined;
    if (heroName && !form.getFieldValue('ws_category')) {
      form.setFieldValue('ws_category', heroName);
    }
    if (currentName && !form.getFieldValue('ws_label')) {
      form.setFieldValue('ws_label', currentName);
    }
    if (form.getFieldValue('ws_min') === undefined || form.getFieldValue('ws_min') === null) {
      form.setFieldValue('ws_min', 0);
    }
    if (form.getFieldValue('ws_max') === undefined || form.getFieldValue('ws_max') === null) {
      form.setFieldValue('ws_max', 0);
    }
  };

  const handleValueTypeChange = (vt: ValueType) => {
    setValueType(vt);
    if (vt === 'workshop_setting') {
      setFileScope('ow1');
      form.setFieldValue('file', 'ow1');
      applyWsDefaults();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async (values: any) => {
    // Clear ws fields if not workshop_setting
    if (values.value_type !== 'workshop_setting') {
      delete values.ws_category;
      delete values.ws_label;
      delete values.ws_setting_type;
      delete values.ws_use_range_syntax;
      delete values.ws_min;
      delete values.ws_max;
    }
    if (editing) {
      await updateProperty(editing.id, values);
    } else {
      await addProperty(abilityId, values);
    }
    form.resetFields();
    onSave();
  };

  const isExpression = valueType === 'expression';
  const isWorkshop = valueType === 'workshop_setting';

  return (
    <Modal
      title={editing ? 'Edit Property' : 'Add Property'}
      open={open}
      onOk={() => form.submit()}
      onCancel={() => { form.resetFields(); onCancel(); }}
      okText={editing ? 'Update' : 'Create'}
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Row gutter={12} align="bottom">
          <Col flex="auto">
            <Form.Item name="name" label="Property Name" rules={[{ required: true, message: 'Required' }]} tooltip="e.g., damage">
              <Input placeholder="e.g., damage" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="enabled" valuePropName="checked" label="Enabled" style={{ marginBottom: 24 }}>
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12} style={{ marginBottom: 8 }}>
          <Col>
            <Form.Item name="value_type" label="Type" style={{ marginBottom: 0 }}>
              <Segmented
                options={[
                  { label: 'Number', value: 'number' },
                  { label: 'Expression', value: 'expression' },
                  { label: 'Workshop', value: 'workshop_setting' },
                ]}
                onChange={v => handleValueTypeChange(v as ValueType)}
              />
            </Form.Item>
          </Col>
          {!isWorkshop && (
            <Col flex="auto">
              <Form.Item name="file" label="File scope" style={{ marginBottom: 0 }}>
                <Segmented
                  options={[
                    { label: 'Both', value: 'both' },
                    { label: 'OW1', value: 'ow1' },
                    { label: 'OW2', value: 'ow2' },
                  ]}
                  onChange={v => setFileScope(v as FileScope)}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={12} style={{ marginTop: 12 }}>
          {(isWorkshop || fileScope !== 'ow2') && (
            <Col span={fileScope === 'both' && !isWorkshop ? 12 : 24}>
              <Form.Item
                name="patched_value"
                label={isWorkshop ? 'Default Value (OW1)' : 'Patched Value (OW1)'}
                rules={[{ required: true, message: 'Required' }]}
              >
                {isExpression
                  ? <Input placeholder="e.g. (150/4)" />
                  : <InputNumber style={{ width: '100%' }} step={0.1} />
                }
              </Form.Item>
            </Col>
          )}
          {!isWorkshop && fileScope !== 'ow1' && (
            <Col span={fileScope === 'both' ? 12 : 24}>
              <Form.Item name="live_value" label="Live Value (OW2)" rules={[{ required: true, message: 'Required' }]}>
                {isExpression
                  ? <Input placeholder="e.g. (150/4)" />
                  : <InputNumber style={{ width: '100%' }} step={0.1} />
                }
              </Form.Item>
            </Col>
          )}
        </Row>

        {isWorkshop && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="ws_category" label="Category" rules={[{ required: true, message: 'Required' }]}>
                  <Input placeholder="e.g. Doomfist" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="ws_label" label="Label" rules={[{ required: true, message: 'Required' }]}>
                  <Input placeholder="e.g. Rocket Punch Damage" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="ws_setting_type" label="Setting type">
                  <Select options={[{ label: 'Float', value: 'float' }, { label: 'Int', value: 'int' }]} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ws_min" label="Min">
                  <InputNumber style={{ width: '100%' }} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ws_max" label="Max">
                  <InputNumber style={{ width: '100%' }} step={0.1} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <button type="submit" hidden />
      </Form>
    </Modal>
  );
};
