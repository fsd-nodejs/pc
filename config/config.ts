// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'FSD Node.js',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },
    {
      path: '/super',
      name: 'super',
      icon: 'crown',
      access: 'canAdmin',
      routes: [
        {
          path: '/super/users',
          name: 'users',
          icon: 'TeamOutlined',
          component: './super/users',
          access: 'canAdmin',
        },
        {
          path: '/super/roles',
          name: 'roles',
          icon: 'UserOutlined',
          component: './super/roles',
          access: 'canAdmin',
        },
        {
          path: '/super/permissions',
          name: 'permissions',
          icon: 'StopOutlined',
          component: './super/permissions',
          access: 'canAdmin',
        },
        {
          path: '/super/menus',
          name: 'menus',
          icon: 'MenuOutlined',
          component: './super/menus',
          access: 'canAdmin',
        },
        {
          path: '/super/logs',
          name: 'logs',
          icon: 'HistoryOutlined',
          component: './super/logs',
          access: 'canAdmin',
        },
      ],
    },
    {
      path: '/admin',
      name: 'admin',
      icon: 'crown',
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/sub-page',
          name: 'sub-page',
          icon: 'smile',
          component: './Welcome',
        },
      ],
    },
    {
      name: 'list.table-list',
      icon: 'table',
      path: '/list',
      component: './ListTableList',
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
