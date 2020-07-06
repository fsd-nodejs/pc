import React from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Row, Button } from 'antd';
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';

import Nestable from 'antd-nestable';

import styles from './index.less';

const items = [
  { id: 0, text: 'Andy' },
  {
    id: 1,
    text: 'Harry',
    children: [{ id: 2, text: 'David' }],
  },
  { id: 3, text: 'Lisa' },
];

const renderItem = (params: any) => params?.item?.text;

export default () => {
  return (
    <PageHeaderWrapper content="这是一个新页面，从这里进行开发！" className={styles.main}>
      <Row>
        <Col span={12}>
          <Card>
            <div>
              <Button
                className={styles.action}
                type="primary"
                icon={<PlusSquareOutlined />}
                onClick={() => {
                  // collapse(0);
                }}
              >
                Expand
              </Button>
              <Button
                className={styles.action}
                type="primary"
                icon={<MinusSquareOutlined />}
                onClick={() => {
                  // collapse(1);
                }}
              >
                Collapse
              </Button>
              <Button
                className={styles.action}
                type="primary"
                icon={<MinusSquareOutlined />}
                onClick={() => {
                  // collapse(2);
                }}
              >
                Collapse2
              </Button>
            </div>
            <Nestable
              items={items}
              renderItem={renderItem}
              onChange={(value: []) => {
                console.log(value);
              }}
            />
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};
