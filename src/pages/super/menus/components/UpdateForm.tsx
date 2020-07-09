import React from 'react';
import { Form, Input, Button, Transfer } from 'antd';
import { useRequest } from 'umi';
import { queryRole } from '@/services/role';

import { TableListItem } from '@/services/menu.d';

interface UpdateFormProps {
  // onCancel: () => void
}

const UpdateForm: React.FC<UpdateFormProps> = () => {
  // const { onCancel } = props
  const [form] = Form.useForm();

  // 预先加载角色选择器数据
  const { data: roleData, loading: roleLoading, error: roleError } = useRequest(() => {
    return queryRole({ pageSize: 1000 });
  });

  const RolesFormItem: React.FC<{ value?: any; onChange?: () => void }> = ({ value, onChange }) => {
    // 过滤默认选择的数据格式
    const newValue = value?.map((row: any) => row.id || row);
    if (roleError) {
      return <div>failed to load</div>;
    }
    if (roleLoading) {
      return <div>loading...</div>;
    }
    return (
      <Transfer
        onChange={onChange}
        titles={['待选', '已选']}
        listStyle={{
          width: 300,
          height: 300,
        }}
        dataSource={roleData.list}
        targetKeys={newValue}
        showSearch
        rowKey={(row: any) => row.id}
        render={(row: any) => row.name}
        pagination
      />
    );
  };

  const onFinish = async (fields: TableListItem) => {
    console.log(fields);
  };

  const onReset = () => {
    form?.resetFields();
  };

  return (
    <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onFinish}>
      <Form.Item
        name="name"
        label="name"
        rules={[
          {
            required: true,
            message: 'name为必填项',
          },
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        name="path"
        label="path"
        rules={[
          {
            required: true,
            message: 'path为必填项',
          },
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="roles" label="角色">
        <RolesFormItem />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateForm;
