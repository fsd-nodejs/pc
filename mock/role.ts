// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
// eslint-disable-next-line
import mockjs from 'mockjs';
import { parse } from 'url';
import { TableListItem, TableListParams } from '@/services/role.d';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index.toString(),
      name: mockjs.Random.name(),
      slug: mockjs.Random.name(),
      permissions: [mockjs.mock({ 'id|+1': 1, name: '@FIRST' })],
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

global.roles = tableListDataSource;

function getRole(req: Request, res: Response, u: string) {
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

  if (params.slug) {
    dataSource = dataSource.filter((data) => data.slug.includes(params.slug || ''));
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
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

function showRole(req: Request, res: Response, u: string) {
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

  const result = {
    success: true,
    data: { ...dataSource[0] },
    errorCode: '200',
    errorMessage: null,
    showType: 0,
  };

  return res.send(result);
}

function postRole(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { method } = req;

  const body = (b && b.body) || req.body;
  const { id, name, slug, permissions } = body;

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
        const newRole = {
          id: tableListDataSource.length.toString(),
          name,
          slug,
          permissions: global.permissions
            ?.filter((item: any) => permissions.includes(item.id))
            .map((item: any) => {
              return {
                id: item.id,
                name: item.name,
              };
            }),
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        tableListDataSource.unshift(newRole);
        return res.status(201).json({
          success: true,
          data: newRole,
          errorCode: '201',
          errorMessage: null,
          showType: 0,
        });
      })();
      return;

    case 'PUT':
      (() => {
        let newRole = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === id) {
            newRole = {
              ...item,
              name,
              slug,
              permissions,
              updatedAt: new Date(),
            };
            return { ...item, ...newRole };
          }
          return item;
        });
        return res.status(201).json({
          success: true,
          data: newRole,
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
  'GET /api/role/query': getRole,
  'GET /api/role/show': showRole,
  'POST /api/role/create': postRole,
  'DELETE /api/role/remove': postRole,
  'PUT /api/role/update': postRole,
};
