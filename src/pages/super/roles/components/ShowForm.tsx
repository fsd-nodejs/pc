import React from 'react';
import { Modal, Form, Input } from 'antd';
import { ProColumns } from '@ant-design/pro-table/lib/Table.d';

import { TableListItem } from '@/services/role.d';

interface ShowFormProps {
  showModalVisible: boolean;
  onCancel: () => void;
  values: Partial<TableListItem>;
  columns: ProColumns<TableListItem>[];
}

const ShowForm: React.FC<ShowFormProps> = (props) => {
  const { showModalVisible, onCancel, values, columns } = props;
  return (
    <Modal
      destroyOnClose
      title="查看角色"
      visible={showModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} initialValues={values}>
        {columns.map(
          (item, index) =>
            item.dataIndex !== 'option' && (
              <Form.Item key={index} label={item.title} name={item.dataIndex} rules={item.rules}>
                <Input disabled />
              </Form.Item>
            ),
        )}
      </Form>
    </Modal>
  );
};

export default ShowForm;
