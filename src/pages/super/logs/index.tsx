import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Tag, Select, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { queryLogs, removeLogs } from '@/services/logs';
import { TableListItem } from '@/services/logs.d';

import styles from './index.less';

const { Option } = Select;

/**
 *  删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeLogs({
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

const MethodTag: React.FC<{ text: string }> = ({ text }) => {
  let color = '#108ee9';
  switch (text) {
    case 'ANY':
      color = '#108ee9';
      break;
    case 'GET':
      color = '#52c41a';
      break;
    case 'POST':
      color = '#faad14';
      break;
    case 'PUT':
      color = '#1890ff';
      break;
    case 'DELETE':
      color = '#ff4d4f';
      break;
    case 'PATCH':
      color = '#13c2c2';
      break;
    case 'OPTIONS':
      color = '#2f54eb';
      break;
    case 'HEAD':
      color = 'lime';
      break;
    default:
  }
  return (
    <Tag color={color} style={{ marginBottom: 8 }}>
      {text}
    </Tag>
  );
};

export default () => {
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
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
      title: '用户',
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
      dataIndex: 'method',
      hideInSearch: true,
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
          message: 'HTTP方法为必填项',
        },
      ],
      render: (_, record: TableListItem) => (
        <>
          {record.method?.length > 0 ? (
            // eslint-disable-next-line react/no-array-index-key
            record.method.map((text, index) => <MethodTag key={index} text={text} />)
          ) : (
            <Tag color="#108ee9">ANY</Tag>
          )}
        </>
      ),
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
      dataIndex: 'path',
      render: (_, record: TableListItem) => <Tag color="#2db7f5">{record.path}</Tag>,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      render: (_, record: TableListItem) => <Tag color="#108ee9">{record.ip}</Tag>,
    },
    {
      title: '参数',
      dataIndex: 'input',
      hideInSearch: true,
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
          const { list, total } = (await queryLogs(params)).data;
          return { data: list, total, success: true };
        }}
        columns={columns}
        rowSelection={{}}
        scroll={{ x: 1400 }}
      />
    </PageHeaderWrapper>
  );
};
