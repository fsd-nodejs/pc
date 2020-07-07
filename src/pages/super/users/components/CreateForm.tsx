import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  createModalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { createModalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={createModalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={768}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;