import { Modal, Table, Form, InputNumber, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

interface ModalTableProps<T> {
  open: boolean;
  onCancel: () => void;
  title: string;
  onSave: () => void;
  data: T[];
  columns: ColumnsType<T>;
  keyField: keyof T;
  editFields?: string[];
  searchFields?: string[];
  onSearch?: (value: string) => void;
  addMode?: boolean;
  formValues?: Partial<T>;
  onFormValuesChange?: (values: Partial<T>) => void;
  searchValue?: string;
}

export function ModalTable<T extends Record<string, any>>({
  open,
  onCancel,
  title,
  onSave,
  data,
  columns,
  keyField,
  editFields = [],
  searchFields = [],
  onSearch,
  addMode = false,
  onFormValuesChange,
  searchValue
}: ModalTableProps<T>) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onFormValuesChange?.(values);
      onSave();
      onCancel();
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const filteredData = data.filter((item) => {
    if (!searchValue || searchValue === '') return true;
    return searchFields.some(field => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(searchValue.toLowerCase());
    });
  });

  return (
    <Modal
      title={addMode ? `Add New ${title}` : `Edit ${title}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={addMode ? 'Create' : 'Update'}
      width={addMode ? 600 : 800}
    >
      <Form form={form} layout="vertical">
        {addMode ? (
          <>
            {editFields.map((field) => (
              <Form.Item
                key={field}
                name={field}
                label={field}
                rules={[{ required: true }]}
                tooltip={field === 'name' ? 'e.g., PATCHED_MELEE_DAMAGE' : undefined}
              >
                {field.includes('Value') ? (
                  <InputNumber style={{ width: '100%' }} step={0.1} />
                ) : field.includes('Name') ? (
                  <Input placeholder={field} />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}
          </>
        ) : null}

        {columns.some((col: ColumnsType<any>[number]) => col.render && typeof col.render === 'function') ? (
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
        ) : null}

        <Table
          showSorterTooltip={false}
          dataSource={filteredData}
          columns={columns}
          rowKey={keyField}
          pagination={columns.some((col: ColumnsType<any>[number]) => col.render && typeof col.render === 'function') ? { pageSize: 10 } : false}
          size="small"
          scroll={{ y: 400 }}
        />
      </Form>
    </Modal>
  );
}

interface TableModalProps<T> {
  open: boolean;
  onSave: () => void;
  title: string;
  entityName: string;
  columns: ColumnsType<T>;
  data: T[];
  keyField: keyof T;
  valueFields: string[];
  editFields: string[];
  _searchFields?: string[];
  _searchValue?: string;
  _onSearch?: (value: string) => void;
}

export function TableModal<T extends Record<string, any>>({
  open,
  onSave,
  title,
  entityName,
  columns,
  data,
  keyField,
  valueFields: _valueFields,
  editFields: _editFields,
  _searchFields = [],
  _searchValue = '',
  _onSearch
}: TableModalProps<T>) {
  return (
    <Modal
      title={`${title} - ${entityName}`}
      open={open}
      onCancel={() => onSave()}
      footer={null}
      width={800}
    >
      <Table
          showSorterTooltip={false}
        dataSource={data}
        columns={columns}
        rowKey={keyField}
        pagination={{ pageSize: 10 }}
        size="small"
      />
    </Modal>
  );
}