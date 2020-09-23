import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  message,
  Tag,
  Popconfirm,
  Upload,
  Input,
  Select,
} from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { FormInstance } from 'antd/es/form';
import { SorterResult } from 'antd/es/table/interface';
import { useRequest } from 'umi';
import ImgCrop from 'antd-img-crop';
import { UploadFile } from 'antd/lib/upload/interface';

import { queryUser, updateUser, createUser, removeUser, showUser } from '@/services/user';
import { queryPermission } from '@/services/permission';
import { queryRole } from '@/services/role';
import { TableListItem } from '@/services/user.d';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ShowForm from './components/ShowForm';

import styles from './index.less';

/**
 * 添加
 * @param fields
 */
const handleCreate = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  const avatar = ((fields.avatar as unknown) as UploadFile[]) || [];
  try {
    await createUser({ ...fields, avatar: avatar[0]?.response?.url });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新
 * @param fields
 */
const handleUpdate = async (fields: TableListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateUser({
      ...fields,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 * 查看
 * @param record
 */
const handleShow = async (record: TableListItem) => {
  const hide = message.loading('正在加载数据');
  try {
    const { data } = await showUser({ id: record.id });
    hide();
    message.success('加载成功');
    return data;
  } catch (error) {
    hide();
    message.error('加载失败请重试！');
    return false;
  }
};

/**
 *  删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeUser({
      id: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export default () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [showModalVisible, setShowModalVisible] = useState<boolean>(false);
  const [currentFormValues, setCurrentFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const creatFormRef = useRef<FormInstance>();
  const updateFormRef = useRef<FormInstance>();

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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      ellipsis: true,
      fixed: 'left',
      width: 80,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      hideInSearch: true,
      width: 50,
      renderFormItem: (item, { value, onChange }) => {
        const fileList =
          typeof value === 'string'
            ? [
                {
                  uid: '-1',
                  status: 'done',
                  url: value,
                  name: value,
                },
              ]
            : value || [];

        return (
          <ImgCrop rotate>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              onChange={({ fileList: newFileList }) => onChange && onChange(newFileList)}
              fileList={fileList}
              onPreview={async (file: any) => {
                let src = file.url;
                if (!src) {
                  src = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj);
                    reader.onload = () => resolve(reader.result);
                  });
                }
                const image = new Image();
                image.src = src;
                const imgWindow: any = window.open(src);
                imgWindow.document.write(image.outerHTML);
              }}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
          </ImgCrop>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 140,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '账号',
      dataIndex: 'username',
      ellipsis: true,
      width: 140,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '账号为必填项',
          },
        ],
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInSearch: true,
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '密码为必填项',
          },
        ],
      },
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return <Input {...rest} type="password" placeholder="请输入" />;
      },
    },
    {
      title: '确认密码',
      dataIndex: 'passwordConfirmation',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return <Input {...rest} type="password" placeholder="请确认密码" />;
      },
      formItemProps: {
        validateFirst: true,
        rules: [
          {
            required: true,
            message: '确认密码为必填项',
          },
          {
            validator: (rules, value, callback) => {
              const password =
                (createModalVisible && creatFormRef.current?.getFieldValue('password')) ||
                (updateModalVisible && updateFormRef.current?.getFieldValue('password'));
              if (password !== value) {
                callback('两次密码输入不一致');
              } else {
                callback();
              }
            },
          },
        ],
      },
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      hideInSearch: true,
      renderFormItem: () => {
        // 过滤默认选择的数据格式
        if (permissionError) {
          return <div>failed to load</div>;
        }
        if (permissionLoading) {
          return <div>loading...</div>;
        }
        return (
          <Select
            showSearch
            allowClear
            mode="multiple"
            filterOption={(inputValue, option) => {
              return (option?.label as string)
                .toLocaleLowerCase()
                .includes(inputValue.toLocaleLowerCase());
            }}
            options={permissionData?.list.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
      render: (_, record: TableListItem) =>
        record.permissions?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={index} color="#87d068" style={{ marginBottom: 8 }}>
            {item.name}
          </Tag>
        )),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      hideInSearch: true,
      renderFormItem: () => {
        if (roleError) {
          return <div>failed to load</div>;
        }
        if (roleLoading) {
          return <div>loading...</div>;
        }
        return (
          <Select
            showSearch
            allowClear
            mode="multiple"
            filterOption={(inputValue, option) => {
              return (option?.label as string)
                .toLocaleLowerCase()
                .includes(inputValue.toLocaleLowerCase());
            }}
            options={roleData?.list.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
      render: (_, record: TableListItem) =>
        record.roles?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={index} color="#87d068" style={{ marginBottom: 8 }}>
            {item.name}
          </Tag>
        )),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              // 编辑前去服务端获取最新的数据
              const success = await handleShow(record);
              if (success) {
                setUpdateModalVisible(true);
                setCurrentFormValues(Object.assign(record, success));
              }
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              // 查看前去服务端获取最新的数据
              const success = await handleShow(record);
              if (success) {
                setShowModalVisible(true);
                setCurrentFormValues(Object.assign(record, success));
              }
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要删除该数据吗?"
            placement="left"
            onConfirm={async () => {
              // 不论是否删除成功，都重新加载列表数据
              await handleRemove([record]);
              actionRef?.current?.reload();
            }}
            style={{ width: 220 }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper content="" className={styles.main}>
      {/* 列表 */}
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={async (params) => {
          const { list, total } = (await queryUser(params)).data;
          return { data: list, total, success: true };
        }}
        columns={columns}
        rowSelection={{}}
        scroll={{ x: 1400 }}
      />

      {/* 创建 */}
      {createModalVisible ? (
        <CreateForm
          onCancel={() => setCreateModalVisible(false)}
          createModalVisible={createModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            formRef={creatFormRef}
            onSubmit={async (values) => {
              const success = await handleCreate(values);
              if (success) {
                setCreateModalVisible(false);
                actionRef.current?.reload();
              }
            }}
            rowKey="id"
            type="form"
            form={{
              labelCol: { span: 5 },
              wrapperCol: { span: 19 },
            }}
            columns={columns}
            rowSelection={{}}
          />
        </CreateForm>
      ) : null}

      {/* 更新 */}
      {updateModalVisible && Object.keys(currentFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentFormValues({});
          }}
          updateModalVisible={updateModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            formRef={updateFormRef}
            onSubmit={async (values) => {
              const success = await handleUpdate({
                ...values,
                id: (currentFormValues as TableListItem).id,
              });
              if (success) {
                setUpdateModalVisible(false);
                setCurrentFormValues({});
                actionRef.current?.reload();
              }
            }}
            rowKey="id"
            type="form"
            form={{
              labelCol: { span: 5 },
              wrapperCol: { span: 19 },
              initialValues: {
                ...currentFormValues,
                permissions: (currentFormValues as TableListItem).permissions?.map((row) => row.id),
                roles: (currentFormValues as TableListItem).roles?.map((row) => row.id),
              },
            }}
            columns={columns}
            rowSelection={{}}
          />
        </UpdateForm>
      ) : null}

      {/* 详情 */}
      {currentFormValues && Object.keys(currentFormValues).length ? (
        <ShowForm
          onCancel={() => {
            setShowModalVisible(false);
            setCurrentFormValues({});
          }}
          showModalVisible={showModalVisible}
          values={currentFormValues}
          columns={columns}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};
