import React from 'react';
import { Form, Input, Button, Transfer, Select } from 'antd';
import { useRequest } from 'umi';
import { queryPermission } from '@/services/permission';
import { queryRole } from '@/services/role';

import { TableListItem } from '@/services/menu.d';

interface UpdateFormProps {
  // onCancel: () => void
}

interface CustomFormItemProps {
  value?: any;
  onChange?: () => void;
  id?: string;
}

const UpdateForm: React.FC<UpdateFormProps> = () => {
  // const { onCancel } = props
  const [form] = Form.useForm();

  // 预先加载权限选择器数据
  const { data: permissionData, loading: permissionLoading, error: permissionError } = useRequest(
    () => {
      return queryPermission({ pageSize: 1000 });
    },
  );

  // 预先加载角色选择器数据
  const { data: roleData, loading: roleLoading, error: roleError } = useRequest(() => {
    return queryRole({ pageSize: 1000 });
  });

  const PermissionsFormItem: React.FC<CustomFormItemProps> = ({ value, onChange }) => {
    // 过滤默认选择的数据格式
    if (permissionError) {
      return <div>failed to load</div>;
    }
    if (permissionLoading) {
      return <div>loading...</div>;
    }
    return (
      <Select
        value={value}
        onChange={onChange}
        showSearch
        style={{ width: 200 }}
        placeholder="Select a person"
        optionFilterProp="children"
        options={permissionData?.list.map((item) => ({
          label: item.name,
          value: item.slug,
        }))}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      />
    );
  };

  const RolesFormItem: React.FC<CustomFormItemProps> = ({ value, onChange }) => {
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
        dataSource={roleData?.list}
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
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      onFinish={(values) => onFinish(values as TableListItem)}
    >
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
      <Form.Item name="permission" label="权限">
        <PermissionsFormItem />
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
