import React from 'react';
import { Modal, Form, Input } from 'antd';
import { ProColumns } from '@ant-design/pro-table/lib/Table.d';
import { TableListItem } from '@/services/permission.d';

interface DetailFormProps {
  detailModalVisible: boolean;
  onCancel: () => void;
  values: Partial<TableListItem>;
  columns: ProColumns<TableListItem>[];
}

const DetailForm: React.FC<DetailFormProps> = (props) => {
  const { detailModalVisible, onCancel, values, columns } = props;
  return (
    <Modal
      destroyOnClose
      title="查看权限"
      visible={detailModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} initialValues={values}>
        {columns.map(
          (item) =>
            item.dataIndex !== 'option' && (
              <Form.Item key={item.key} label={item.title} name={item.dataIndex} rules={item.rules}>
                <Input disabled />
              </Form.Item>
            ),
        )}
      </Form>
    </Modal>
  );
};

export default DetailForm;
