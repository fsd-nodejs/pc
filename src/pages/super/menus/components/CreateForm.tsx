import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Space } from 'antd';

import { TableListItem } from '@/services/menu.d';
import BaseFormItems from './BaseFormItems';

export interface CreateFormHandleProps {
  reset: () => void;
}

interface CreateFormProps {
  onCancel?: () => void;
  onSubmit: (value: TableListItem) => void;
}

const CreateForm: React.RefForwardingComponent<CreateFormHandleProps, CreateFormProps> = (
  { onSubmit },
  ref,
) => {
  // const { onCancel } = props
  const [form] = Form.useForm();

  const onFinish = async (fields: TableListItem) => {
    onSubmit(fields);
  };

  const onReset = () => {
    form?.resetFields();
  };

  useImperativeHandle(ref, () => ({
    reset: (): void => {
      onReset();
    },
  }));

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={(values) => onFinish(values as TableListItem)}
    >
      <BaseFormItems />
      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Space size="middle" direction="horizontal" align="center">
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default forwardRef(CreateForm);
