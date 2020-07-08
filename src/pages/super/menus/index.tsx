import React, { useRef } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button } from 'antd';
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FormOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ToolBar from '@/components/ToolBar';

import Nestable from 'antd-nestable';

import styles from './index.less';

const items = [
  { id: 0, title: 'Welcome', icon: 'smile', name: 'welcome', url: '/welcome' },
  {
    id: 1,
    title: 'Super',
    icon: 'crown',
    name: 'super',
    url: '/super',
    children: [
      {
        id: 2,
        title: 'Users',
        icon: 'TeamOutlined',
        name: 'users',
        url: '/super/users',
      },
      {
        id: 3,
        title: 'Roles',
        icon: 'UserOutlined',
        name: 'roles',
        url: '/super/roles',
      },
      {
        id: 4,
        title: 'Permissions',
        icon: 'StopOutlined',
        name: 'permissions',
        url: '/super/permissions',
      },
      {
        id: 5,
        title: 'Menus',
        icon: 'MenuOutlined',
        name: 'menus',
        url: '/super/menus',
      },
      {
        id: 8,
        title: 'Logs',
        icon: 'HistoryOutlined',
        name: 'logs',
        url: '/super/logs',
      },
    ],
  },
  {
    id: 6,
    title: 'Admin',
    icon: 'crown',
    name: 'admin',
    url: '/admin',
    children: [
      {
        id: 7,
        title: 'Sub-Page',
        icon: 'smile',
        name: 'sub-page',
        url: '/admin/sub-page',
      },
    ],
  },
  {
    id: 7,
    title: 'Table-List',
    icon: 'table',
    name: 'list',
    url: '/list',
  },
];

const renderItem = (params: any) => {
  return (
    <>
      {params.handle}
      {params.collapseIcon}
      <strong>{params?.item.title}</strong>
      {params?.item.icon && `  [${params?.item.icon}]`}
      &nbsp;&nbsp;
      <a href="#">{params?.item.url}</a>
      <span className="pull-right">
        <a
          onClick={() => {
            console.log('编辑');
          }}
        >
          <FormOutlined />
        </a>
        &nbsp;&nbsp;
        <a
          onClick={() => {
            console.log('删除');
          }}
        >
          <DeleteOutlined />
        </a>
      </span>
    </>
  );
};

export default () => {
  const nestableRef = useRef<{ collapse: (type: string | number[]) => void }>();
  const collapse = (collapseCase: number, expendIds?: number[]) => {
    if (nestableRef.current) {
      switch (collapseCase) {
        case 0:
          nestableRef.current?.collapse('NONE');
          break;
        case 1:
          nestableRef.current?.collapse('ALL');
          break;
        case 2:
          nestableRef.current?.collapse(expendIds || []);
          break;
        default:
      }
    }
  };
  return (
    <PageHeaderWrapper
      content="菜单管理仅做权限配置，路由注册、名称、Icon、地址配置均在前端编码完成。"
      className={styles.main}
    >
      <Card bodyStyle={{ padding: 0 }}>
        <ToolBar
          headerTitle="查询表格"
          toolBarRender={() => [
            <Button type="primary" onClick={() => {}}>
              <PlusOutlined /> 新建
            </Button>,
          ]}
          toolBarOptionRender={() => [
            <span
              className="ant-pro-table-toolbar-item-icon"
              title="展开"
              onClick={() => {
                collapse(0);
              }}
            >
              <PlusSquareOutlined />
            </span>,
            <span
              className="ant-pro-table-toolbar-item-icon"
              title="折叠"
              onClick={() => {
                collapse(1);
              }}
            >
              <MinusSquareOutlined />
            </span>,
            <span
              className="ant-pro-table-toolbar-item-icon"
              title="保存"
              onClick={() => {
                // collapse(0);
              }}
            >
              <SaveOutlined />
            </span>,
            <span
              className="ant-pro-table-toolbar-item-icon"
              title="刷新"
              onClick={() => {
                // collapse(0);
              }}
            >
              <ReloadOutlined />
            </span>,
          ]}
        />
        <div className="ant-pro-table-container">
          <Nestable
            ref={nestableRef}
            items={items}
            renderItem={renderItem}
            onChange={(value: []) => {
              console.log(value);
            }}
          />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};
