// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, TableListParams } from '@/services/menu.d';

// mock tableListDataSource
let tableListDataSource: TableListItem[] = [
  {
    id: '0',
    name: 'welcome',
    path: '/welcome',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '',
  },
  {
    id: '1',
    name: 'super',
    path: '/super',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '',
  },
  {
    id: '2',
    name: 'users',
    path: '/super/users',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '1',
  },
  {
    id: '3',
    name: 'roles',
    path: '/super/roles',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '1',
  },
  {
    id: '4',
    name: 'permissions',
    path: '/super/permissions',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '1',
  },
  {
    id: '5',
    name: 'menus',
    path: '/super/menus',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '1',
  },
  {
    id: '6',
    name: 'logs',
    path: '/super/logs',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '1',
  },
  {
    id: '7',
    name: 'admin',
    path: '/admin',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '',
  },
  {
    id: '8',
    name: 'sub-page',
    path: '/admin/sub-page',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '7',
  },
  {
    id: '9',
    name: 'list',
    path: '/list',
    permission: '',
    roles: [],
    updatedAt: new Date(),
    parentId: '',
  },
];

global.menus = tableListDataSource;

function getMenu(req: Request, res: Response, u: string) {
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

  const result = {
    success: true,
    data: {
      list: dataSource,
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

function showMenu(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const params = (parse(realUrl, true).query as unknown) as TableListParams;
  let dataSource = [...tableListDataSource];

  if (params.id) {
    dataSource = dataSource.filter((data) => data.id === params.id);
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

  const result = {
    success: true,
    data: { ...dataSource[0] },
    errorCode: '200',
    errorMessage: null,
    showType: 0,
  };

  return res.send(result);
}

function postMenu(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { method } = req;

  const body = (b && b.body) || req.body;
  const { name, path, id, parentId, permission, roles } = body;

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
        const newMenu = {
          id: tableListDataSource.length.toString(),
          name,
          path,
          parentId,
          permission,
          roles: global.roles
            ?.filter((row: any) => roles.includes(row.id))
            .map((row: any) => {
              return {
                id: row.id,
                name: row.name,
              };
            }),
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        tableListDataSource.unshift(newMenu);
        return res.status(201).json({
          success: true,
          data: newMenu,
          errorCode: '201',
          errorMessage: null,
          showType: 0,
        });
      })();
      return;

    case 'PUT':
      (() => {
        let newMenu = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === id) {
            newMenu = {
              ...item,
              name,
              path,
              parentId,
              roles: global.roles
                ?.filter((row: any) => roles.includes(row.id))
                .map((row: any) => {
                  return {
                    id: row.id,
                    name: row.name,
                  };
                }),
              permission,
              updatedAt: new Date(),
            };
            return { ...item, ...newMenu };
          }
          return item;
        });
        return res.status(201).json({
          success: true,
          data: newMenu,
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

export default {
  'GET /api/menu/query': getMenu,
  'GET /api/menu/show': showMenu,
  'POST /api/menu/create': postMenu,
  'DELETE /api/menu/remove': postMenu,
  'PUT /api/menu/update': postMenu,
};
