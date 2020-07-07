import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020 蚂蚁金服体验技术部 + FSD Node.js 联合出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/fsd-nodejs',
        blankTarget: true,
      },
      {
        key: 'FSD Node.js',
        title: 'FSD Node.js',
        href: 'https://fsd-nodejs.github.io/document/',
        blankTarget: true,
      },
    ]}
  />
);
