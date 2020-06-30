import React from 'react';
import { Modal } from 'antd';
import { TableListItem } from '@/services/permission.d';

interface DetailFormProps {
  detailModalVisible: boolean;
  onCancel: () => void;
  values: Partial<TableListItem>;
}

const DetailForm: React.FC<DetailFormProps> = (props) => {
  const { detailModalVisible, onCancel } = props;

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
