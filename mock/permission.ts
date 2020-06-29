// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import mockjs from 'mockjs';
import { parse } from 'url';
import { TableListItem, TableListParams } from '@/services/permission.d';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      name: mockjs.Random.name(),
      slug: mockjs.Random.name(),
      httpMethod: mockjs.Random.pick(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
      httpPath: mockjs.Random.url().split(':/')[1],
      desc: mockjs.Random.paragraph(1, 4),
      status: Math.floor(Math.random() * 10) % 2,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }

  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getPermission(req: Request, res: Response, u: string) {
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

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource: TableListItem[] = [];
    status.forEach((s: string) => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter((item) => {
          if (parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)) {
            return true;
          }
          return false;
        }),
      );
    });
    dataSource = filterDataSource;
  }

  if (params.id) {
    dataSource = dataSource.filter((data) => params.id.indexOf(data.id) !== -1);
  }

  if (params.slug) {
    dataSource = dataSource.filter((data) => data.slug.includes(params.slug || ''));
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
  }

  if (params.httpPath) {
    dataSource = dataSource.filter((data) => data.httpPath.includes(params.httpPath || ''));
  }
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

function postPermission(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key, httpMethod, httpPath } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.id) === -1);
      break;
    case 'post':
      (() => {
        const newPermission = {
          id: tableListDataSource.length,
          name,
          slug: '',
          httpMethod,
          httpPath,
          desc,
          status: 1,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        tableListDataSource.unshift(newPermission);
        return res.json(newPermission);
      })();
      return;

    case 'update':
      (() => {
        let newPermission = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === key) {
            newPermission = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newPermission);
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
  'GET /api/permission/query': getPermission,
  'GET /api/permission/show': getPermission,
  'POST /api/permission/create': postPermission,
  'POST /api/permission/remove': postPermission,
  'POST /api/permission/update': postPermission,
};
