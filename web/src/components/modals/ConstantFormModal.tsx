import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Row, Col, Switch, Tooltip, Segmented, Select, Divider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import type { Constant, FileScope, ValueType } from '../../types';

interface ConstantFormModalProps {
  open: boolean;
  editing?: Constant | null;
  onCancel: () => void;
  onSave: () => void;
}

export const ConstantFormModal: React.FC<ConstantFormModalProps> = ({
  open,
  editing,
  onCancel,
  onSave,
}) => {
  const { addConstant, updateConstant } = useApp();
  const [form] = Form.useForm();
  const [isShared, setIsShared] = useState(false);
  const [valueType, setValueType] = useState<ValueType>('number');
  const [fileScope, setFileScope] = useState<FileScope>('both');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const removePrefix = editing.remove_prefix ?? false;
      const vt = editing.value_type ?? 'number';
      const fs = editing.file ?? 'both';
      setIsShared(removePrefix);
      setValueType(vt);
      setFileScope(vt === 'workshop_setting' ? 'ow1' : fs);
      form.setFieldsValue({
        display_name: editing.display_name,
        constant_name: editing.constant_name,
        remove_prefix: removePrefix,
        value_type: vt,
        value: editing.patched_value,
        patched_value: editing.patched_value,
        live_value: editing.live_value,
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
      setIsShared(false);
      setValueType('number');
      setFileScope('both');
      form.setFieldsValue({
        remove_prefix: false,
        value_type: 'number',
        value: 0,
        patched_value: 0,
        live_value: 0,
        enabled: true,
        file: 'both',
        ws_setting_type: 'float',
      });
    }
  }, [open, editing, form]);

  const handleRemovePrefixChange = (checked: boolean) => {
    setIsShared(checked);
  };

  const handleValueTypeChange = (vt: ValueType) => {
    setValueType(vt);
    if (vt === 'workshop_setting') {
      setFileScope('ow1');
      form.setFieldValue('file', 'ow1');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async (values: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...values };
    if (values.remove_prefix) {
      payload.patched_value = values.value;
      payload.live_value = values.value;
    }
    delete payload.value;

    // Clear ws fields if not workshop_setting
    if (values.value_type !== 'workshop_setting') {
      delete payload.ws_category;
      delete payload.ws_label;
      delete payload.ws_setting_type;
      delete payload.ws_use_range_syntax;
      delete payload.ws_min;
      delete payload.ws_max;
    }

    if (editing) {
      await updateConstant(editing.id, payload);
    } else {
      await addConstant(payload);
    }
    form.resetFields();
    onSave();
  };

  const isExpression = valueType === 'expression';
  const isWorkshop = valueType === 'workshop_setting';

  return (
    <Modal
      title={editing ? 'Edit Constant' : 'Add Constant'}
      open={open}
      onOk={() => form.submit()}
      onCancel={() => { form.resetFields(); onCancel(); }}
      okText={editing ? 'Update' : 'Create'}
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="display_name"
              label="Display Name"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input
                placeholder="e.g., Melee Damage"
                onChange={e => {
                  if (!editing) {
                    form.setFieldValue(
                      'constant_name',
                      e.target.value.toUpperCase().replace(/\s+/g, '_').replace(/[^\w]/g, '')
                    );
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="constant_name"
              label="Constant Name"
              rules={[{ required: true, message: 'Required' }]}
              tooltip="UPPER_SNAKE_CASE. Prefix with OW1_ for versioned constants."
            >
              <Input placeholder="e.g., OW1_MELEE_DAMAGE" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12} align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Form.Item name="enabled" valuePropName="checked" label="Enabled" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>
          </Col>
          <Col>
             <Form.Item name="remove_prefix" valuePropName="checked" style={{ marginBottom: 0 }}
               label={
                 <span>
                   Remove Prefix&nbsp;
                   <Tooltip title="When enabled, constants will be emitted without OW1_ or OW2_ prefixes.">
                     <QuestionCircleOutlined style={{ color: '#8a8070' }} />
                   </Tooltip>
                 </span>
               }
             >
               <Switch onChange={handleRemovePrefixChange} />
             </Form.Item>
           </Col>
          <Col flex="auto">
            <Form.Item name="value_type" label="Value type" style={{ marginBottom: 0 }}>
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
        </Row>

        {!isWorkshop && (
          <Row gutter={12} style={{ marginBottom: 8 }}>
            <Col span={24}>
              <Form.Item name="file" label="File scope" style={{ marginBottom: 0 }}>
                <Segmented
                  options={[
                    { label: 'Both', value: 'both' },
                    { label: 'OW1 only', value: 'ow1' },
                    { label: 'OW2 only', value: 'ow2' },
                  ]}
                  onChange={v => setFileScope(v as FileScope)}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {isShared ? (
          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: 'Required' }]}
            tooltip={isExpression ? 'e.g. (150/4) or (-9.8)' : undefined}
          >
            {isExpression
              ? <Input placeholder="e.g. (150/4)" />
              : <InputNumber style={{ width: '100%' }} step={0.1} />
            }
          </Form.Item>
        ) : (
          <Row gutter={12}>
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
                <Form.Item
                  name="live_value"
                  label="Live Value (OW2)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  {isExpression
                    ? <Input placeholder="e.g. (150/4)" />
                    : <InputNumber style={{ width: '100%' }} step={0.1} />
                  }
                </Form.Item>
              </Col>
            )}
          </Row>
        )}

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
