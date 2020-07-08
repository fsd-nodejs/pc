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
  { id: 0, title: 'Andy', icon: 'smile', slug: 'super.andy', url: '/super/andy' },
  {
    id: 1,
    title: 'Menus',
    slug: 'super.menus',
    url: '/super/menus',
    children: [{ id: 2, title: 'David', slug: 'super.david', url: '/super/david' }],
  },
  { id: 3, title: 'Lisa', slug: 'super.lisa', url: '/super/lisa' },
];

const renderItem = (params: any) => {
  return (
    <>
      {params.handle}
      {params.collapseIcon}
      <strong>
        {params?.item.icon && `[${params?.item.icon}] `}
        {params?.item.title}
      </strong>
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
    <PageHeaderWrapper content="" className={styles.main}>
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
