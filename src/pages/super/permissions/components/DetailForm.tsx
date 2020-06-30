import React from 'react';
import { Modal } from 'antd';
import { TableListItem } from '@/services/permission.d';
import { ProColumns } from '@ant-design/pro-table/lib/Table.d';

interface DetailFormProps {
  detailModalVisible: boolean;
  onCancel: () => void;
  values: Partial<TableListItem>;
  columns: ProColumns<TableListItem>[];
}

const DetailForm: React.FC<DetailFormProps> = (props) => {
  const { detailModalVisible, onCancel, values, columns } = props;
  console.log(props.children);
  console.log(values);
  console.log(columns);
  return (
    <Modal
      destroyOnClose
      title="查看权限"
      visible={detailModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default DetailForm;
