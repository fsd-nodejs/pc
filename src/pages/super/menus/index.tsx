import React, { useRef } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Alert, Row, Col } from 'antd';
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
import UpdateForm from './components/UpdateForm';

const items = [
  {
    id: 0,
    name: 'welcome',
    path: '/welcome',
    permission: '',
    roles: [],
    updatedAt: '2020-07-03 06:16:11',
  },
  {
    id: 1,
    name: 'super',
    path: '/super',
    permission: '',
    roles: [],
    updatedAt: '2020-07-03 06:16:11',
    children: [
      {
        id: 2,
        name: 'users',
        path: '/super/users',
        permission: '',
        roles: [],
        updatedAt: '2020-07-03 06:16:11',
      },
      {
        id: 3,
        name: 'roles',
        path: '/super/roles',
        permission: '',
        roles: [],
        updatedAt: '2020-07-03 06:16:11',
      },
      {
        id: 4,
        name: 'permissions',
        path: '/super/permissions',
        permission: '',
        roles: [],
        updatedAt: '2020-07-03 06:16:11',
      },
      {
        id: 5,
        name: 'menus',
        path: '/super/menus',
        permission: '',
        roles: [],
        updatedAt: '2020-07-03 06:16:11',
      },
      {
        id: 8,
        name: 'logs',
        path: '/super/logs',
        permission: '',
        roles: [],
        updatedAt: '2020-07-03 06:16:11',
      },
    ],
  },
  {
    id: 6,
    name: 'admin',
    path: '/admin',
    permission: '',
    roles: [],
    updatedAt: '2020-07-03 06:16:11',
    children: [
      {
        id: 7,
        name: 'sub-page',
        path: '/admin/sub-page',
        permission: '',
        roles: [],
        updatedAt: '2020-07-03 06:16:11',
      },
    ],
  },
  {
    id: 7,
    name: 'list',
    path: '/list',
    permission: '',
    roles: [],
    updatedAt: '2020-07-03 06:16:11',
  },
];

const renderItem = (params: any) => {
  return (
    <>
      {params.handle}
      {params.collapseIcon}
      <strong>{params.item?.name}</strong>
      &nbsp;&nbsp;
      <a href="#">{params.item?.path}</a>
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
    <PageHeaderWrapper className={styles.main}>
      <Row gutter={[24, 24]}>
        <Col md={12} sm={24}>
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
            <div className="ant-pro-table-alert">
              <Alert
                message={
                  <>
                    菜单管理仅做权限配置
                    <br /> 路由注册、name、Icon、地址配置均在前端编码完成
                    <br />
                    左侧菜单显示的名称在locales做国际化配置
                    <br />
                    需要鉴权的页面，在 config.ts 中配置 access: &apos;canAdmin&apos; 即可走鉴权
                  </>
                }
                type="info"
                showIcon
              />
            </div>
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
        </Col>
        <Col md={12} sm={24}>
          <Card>
            <UpdateForm />
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};
