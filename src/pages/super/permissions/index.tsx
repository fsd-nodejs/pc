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
  showPermission,
} from '@/services/permission';
import { TableListItem } from '@/services/permission.d';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ShowForm from './components/ShowForm';

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
 * 查看
 * @param record
 */
const handleShow = async (record: TableListItem) => {
  const hide = message.loading('正在加载数据');
  try {
    const { data } = await showPermission({ id: record.id });
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
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [showModalVisible, setShowModalVisible] = useState<boolean>(false);
  const [currentFormValues, setCurrentFormValues] = useState({});
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
            <Option value="ANY">ANY</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="PATCH">PATCH</Option>
            <Option value="OPTIONS">OPTIONS</Option>
            <Option value="HEAD">HEAD</Option>
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
        ANY: { text: 'ANY', status: 'Default' },
        GET: { text: 'GET', status: 'Default' },
        POST: { text: 'POST', status: 'Default' },
        PUT: { text: 'PUT', status: 'Default' },
        DELETE: { text: 'DELETE', status: 'Default' },
        PATCH: { text: 'PATCH', status: 'Default' },
        OPTIONS: { text: 'OPTIONS', status: 'Default' },
        HEAD: { text: 'HEAD', status: 'Default' },
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
      hideInTable: true,
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
          const { list, total } = (await queryPermission(params)).data;
          return { data: list, total, success: true };
        }}
        columns={columns}
        rowSelection={{}}
        scroll={{ x: 1400 }}
      />

      {/* 创建 */}
      <CreateForm
        onCancel={() => setCreateModalVisible(false)}
        createModalVisible={createModalVisible}
      >
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleCreate(value);
            if (success) {
              setCreateModalVisible(false);
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
      {currentFormValues && Object.keys(currentFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentFormValues({});
          }}
          updateModalVisible={updateModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleUpdate({
                ...value,
                id: (currentFormValues as TableListItem).id,
              });
              if (success) {
                setUpdateModalVisible(false);
                setCurrentFormValues({});
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
              initialValues: currentFormValues,
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
