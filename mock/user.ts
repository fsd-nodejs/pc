import { Request, Response } from 'express';
// eslint-disable-next-line
import mockjs from 'mockjs';
import { parse } from 'url';
import { TableListItem, TableListParams } from '@/services/user.d';

function getFakeCaptcha(req: Request, res: Response) {
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// start: 用户管理
// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 1; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    const name = mockjs.Random.name();
    tableListDataSource.push({
      id: index.toString(),
      username: mockjs.Random.first(),
      name,
      avatar: mockjs.Random.image(
        '250x250',
        mockjs.Random.color(),
        '#fff',
        name.substr(0, 1).toUpperCase(),
      ),
      roles: [
        mockjs.mock({
          id: mockjs.Random.pick(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
          name: '@FIRST',
        }),
      ],
      permissions: [
        mockjs.mock({
          id: mockjs.Random.pick(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
          name: '@FIRST',
        }),
      ],
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 22);

function getUser(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as TableListParams;
  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.id) {
    dataSource = dataSource.filter((data) => data.id.includes(params.id || ''));
  }

  if (params.username) {
    dataSource = dataSource.filter((data) => data.username.includes(params.username || ''));
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
  }

  const result = {
    success: true,
    data: {
      list: dataSource.map((item) => {
        const { password, ...data } = item;
        return data;
      }),
      total: tableListDataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
    errorCode: '200',
    errorMessage: null,
    showType: 0,
  };

  return res.json(result);
}

function showUser(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as TableListParams;
  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  if (params.id) {
    dataSource = dataSource.filter((data) => data.id.includes(params.id || ''));
  }
  if (dataSource.length === 0) {
    return res.status(404).json({
      success: true,
      data: null,
      errorCode: '404',
      errorMessage: '找不到对应的数据',
      showType: 0,
    });
  }
  const { password, ...data } = dataSource[0];
  const result = {
    success: true,
    data: {
      ...data,
      password: '$2y$10$.P9ibseb6ZRlfxqU8MJAou2fqbIsR9JGB7dXsEiShM72z1MAERm0u',
      passwordConfirmation: '$2y$10$.P9ibseb6ZRlfxqU8MJAou2fqbIsR9JGB7dXsEiShM72z1MAERm0u',
    },
    errorCode: '200',
    errorMessage: null,
    showType: 0,
  };

  return res.send(result);
}

function postUser(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { method } = req;

  const body = (b && b.body) || req.body;
  const { id, name, username, avatar, password, roles, permissions } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      (() => {
        tableListDataSource = tableListDataSource.filter((item) => id.indexOf(item.id) === -1);
        return res.status(204).send();
      })();
      return;
    case 'POST':
      (() => {
        const newUser = {
          id: tableListDataSource.length.toString(),
          name,
          username,
          password,
          avatar,
          roles: global.roles
            ?.filter((row: any) => roles.includes(row.id))
            .map((row: any) => {
              return {
                id: row.id,
                name: row.name,
              };
            }),
          permissions: global.permissions
            ?.filter((row: any) => permissions.includes(row.id))
            .map((row: any) => {
              return {
                id: row.id,
                name: row.name,
              };
            }),
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        tableListDataSource.unshift(newUser);
        return res.status(201).json({
          success: true,
          data: newUser,
          errorCode: '201',
          errorMessage: null,
          showType: 0,
        });
      })();
      return;

    case 'PUT':
      (() => {
        let newUser = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === id) {
            newUser = {
              ...item,
              name,
              username,
              password,
              avatar,
              roles: global.roles
                ?.filter((row: any) => roles.includes(row.id))
                .map((row: any) => {
                  return {
                    id: row.id,
                    name: row.name,
                  };
                }),
              permissions: global.permissions
                ?.filter((row: any) => permissions.includes(row.id))
                .map((row: any) => {
                  return {
                    id: row.id,
                    name: row.name,
                  };
                }),
              updatedAt: new Date(),
            };
            return { ...item, ...newUser };
          }
          return item;
        });
        return res.status(201).json({
          success: true,
          data: newUser,
          errorCode: '201',
          errorMessage: null,
          showType: 0,
        });
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}
// end: 用户管理

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).json({
        success: false,
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        showType: 0,
      });
      return;
    }
    res.json({
      success: true,
      data: {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
      errorCode: '200',
      errorMessage: null,
      showType: 0,
    });
  },
  // GET POST 可省略
  'GET /api/users': {
    success: true,
    data: {
      list: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
        },
      ],
      current: 1,
      pageSize: 10,
      total: 3,
    },
    errorCode: '200',
    errorMessage: null,
    showType: 0,
  },
  'POST /api/login/account': (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    if (password === 'ant.design' && username === 'admin') {
      setTimeout(() => {
        res.json({
          success: true,
          data: {
            status: 'ok',
            type,
            currentAuthority: 'admin',
          },
          errorCode: '200',
          errorMessage: null,
          showType: 0,
        });
        access = 'admin';
      }, 1000);
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.json({
        success: true,
        data: {
          status: 'ok',
          type,
          currentAuthority: 'user',
        },
        errorCode: '200',
        errorMessage: null,
        showType: 0,
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.json({
        success: true,
        data: {
          status: 'ok',
          type,
          currentAuthority: 'admin',
        },
        errorCode: '200',
        errorMessage: null,
        showType: 0,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        status: 'error',
        type,
        currentAuthority: 'guest',
      },
      errorCode: '200',
      errorMessage: null,
      showType: 0,
    });
    access = 'guest';
  },
  'GET /api/login/outLogin': (req: Request, res: Response) => {
    access = '';
    res.json({
      success: true,
      data: {},
      errorCode: '200',
      errorMessage: null,
      showType: 0,
    });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        currentAuthority: 'user',
        success: true,
      },
      errorCode: '200',
      errorMessage: null,
      showType: 0,
    });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).json({
      success: false,
      data: null,
      errorCode: 500,
      errorMessage: 'error',
      showType: 2,
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).json({
      success: true,
      data: null,
      errorCode: 404,
      errorMessage: 'Not Found',
      showType: 2,
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).json({
      success: true,
      data: null,
      errorCode: 403,
      errorMessage: 'No Permission',
      showType: 2,
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).json({
      success: true,
      data: null,
      errorCode: 401,
      errorMessage: 'Unauthorized',
      showType: 2,
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,

  'GET /api/user/query': getUser,
  'GET /api/user/show': showUser,
  'POST /api/user/create': postUser,
  'DELETE /api/user/remove': postUser,
  'PUT /api/user/update': postUser,
};
