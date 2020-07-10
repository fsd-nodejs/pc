import React, { useRef } from 'react';
import { useRequest } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Alert, Row, Col, message, Popconfirm } from 'antd';
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FormOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Nestable from 'antd-nestable';
import ToolBar from '@/components/ToolBar';

import { queryMenu, removeMenu } from '@/services/menu';
import { TableListItem } from '@/services/menu.d';

import { arrayTransTree } from '@/utils/utils';

import styles from './index.less';
import UpdateForm from './components/UpdateForm';

/**
 *  删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeMenu({
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
  const nestableRef = useRef<{ collapse: (type: string | number[]) => void }>();

  // 预先加载权限选择器数据
  const { data, loading, error, run } = useRequest(
    () => {
      return queryMenu({ pageSize: 1000 });
    },
    { throttleInterval: 500 },
  );

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
          <Popconfirm
            title={
              <>
                你确定要删除该数据吗?
                <br />
                删除后子节点也将同时被删除
              </>
            }
            placement="left"
            onConfirm={async () => {
              // 不论是否删除成功，都重新加载列表数据
              await handleRemove([params.item]);
              run();
            }}
            style={{ width: 220 }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">
              <DeleteOutlined />
            </a>
          </Popconfirm>
        </span>
      </>
    );
  };

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

  const NestableBox = () => {
    // 过滤默认选择的数据格式
    if (error) {
      return <div>failed to load</div>;
    }
    if (loading) {
      return <div>loading...</div>;
    }
    const items = arrayTransTree(data?.list as any[], 'parentId') || [];
    return (
      <Nestable
        ref={nestableRef}
        items={items}
        renderItem={renderItem}
        onChange={(value: []) => {
          console.log(value);
        }}
      />
    );
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
                <span className="ant-pro-table-toolbar-item-icon" title="刷新" onClick={run}>
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
              <NestableBox />
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
