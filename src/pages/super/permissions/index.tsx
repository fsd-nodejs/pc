import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Tag, Select, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import {
  queryPermission,
  updatePermission,
  createPermission,
  removePermission,
} from '@/services/permission';
import { TableListItem } from '@/services/permission.d';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import styles from './index.less';

const { Option } = Select;

/**
 * 添加
 * @param fields
 */
const handleCreate = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await createPermission({ ...fields });
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
    await updatePermission({
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
 *  删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removePermission({
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      ellipsis: true,
      fixed: 'left',
      width: 80,
      rules: [
        {
          required: true,
          message: 'ID为必填项',
        },
      ],
    },
    {
      title: '标识',
      dataIndex: 'slug',
      ellipsis: true,
      width: 140,
      rules: [
        {
          required: true,
          message: '标识为必填项',
        },
      ],
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 140,
      rules: [
        {
          required: true,
          message: '名称为必填项',
        },
      ],
    },
    {
      title: 'HTTP方法',
      dataIndex: 'httpMethod',
      hideInTable: true,
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: 'HTTP方法为必填项',
        },
      ],
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Select {...rest} mode="multiple" style={{ width: '100%' }} placeholder="请选择HTTP方法">
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="PATCH">PATCH</Option>
            <Option value="OPTIONS">OPTIONS</Option>
          </Select>
        );
      },
    },
    {
      title: 'HTTP路径',
      dataIndex: 'httpPath',
      hideInTable: true,
      valueType: 'textarea',
      rules: [
        {
          required: true,
          message: 'HTTP路径为必填项',
        },
      ],
    },
    {
      title: '路由',
      dataIndex: 'httpMethod',
      hideInSearch: true,
      hideInForm: true,
      valueEnum: {
        GET: { text: 'GET', status: 'Default' },
        POST: { text: 'POST', status: 'Default' },
        PUT: { text: 'PUT', status: 'Default' },
        DELETE: { text: 'DELETE', status: 'Default' },
        PATCH: { text: 'PATCH', status: 'Default' },
        OPTIONS: { text: 'OPTIONS', status: 'Default' },
      },
      rules: [
        {
          required: true,
          message: '标识为必填项',
        },
      ],
      render: (_, record: TableListItem) => (
        <>
          {record.httpMethod?.length > 0 ? (
            record.httpMethod.map((text, index) => (
              <Tag key={index} color="#108ee9" style={{ marginBottom: 8 }}>
                {text}
              </Tag>
            ))
          ) : (
            <Tag color="#108ee9">ANY</Tag>
          )}
          <Tag color="red">{record.httpPath}</Tag>
        </>
      ),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: true,
      width: 220,
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
            onClick={() => {
              handleUpdateModalVisible(true);
              setUpdateFormValues(record);
            }}
          >
            编辑
          </a>
          {/* <Divider type="vertical" />
          <a href="">编辑</a> */}
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要删除该数据吗?"
            placement="left"
            onConfirm={async () => {
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
          <Button type="primary" onClick={() => handleModalVisible(true)}>
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
        request={(params) => queryPermission(params)}
        columns={columns}
        rowSelection={{}}
        scroll={{ x: 1400 }}
      />

      {/* 创建 */}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleCreate(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
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

      {/* 更新 */}
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          updateModalVisible={updateModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleUpdate({
                ...value,
                id: (updateFormValues as TableListItem).id,
              });
              if (success) {
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="id"
            type="form"
            form={{
              labelCol: { span: 5 },
              wrapperCol: { span: 19 },
              initialValues: updateFormValues,
            }}
            columns={columns}
            rowSelection={{}}
          />
        </UpdateForm>
      ) : null}
    </PageHeaderWrapper>
  );
};
