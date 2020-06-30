// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
// eslint-disable-next-line
import mockjs from 'mockjs';
import { parse } from 'url';
import { TableListItem, TableListParams } from '@/services/permission.d';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index.toString(),
      name: mockjs.Random.name(),
      slug: mockjs.Random.name(),
      httpMethod: [mockjs.Random.pick(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])],
      httpPath: mockjs.Random.url().split(':/')[1],
      desc: mockjs.Random.paragraph(1, 4),
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

  if (params.id) {
    dataSource = dataSource.filter((data) => data.id.includes(params.id || ''));
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

function showPermission(req: Request, res: Response, u: string) {
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

function postPermission(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { method } = req;

  const body = (b && b.body) || req.body;
  const { name, desc, id, httpMethod, httpPath, slug } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      tableListDataSource = tableListDataSource.filter((item) => id.indexOf(item.id) === -1);
      (() => {
        return res.status(204);
      })();
      return;
    case 'POST':
      (() => {
        const newPermission = {
          id: tableListDataSource.length.toString(),
          name,
          slug,
          httpMethod,
          httpPath,
          desc,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        tableListDataSource.unshift(newPermission);
        return res.status(201).json({
          success: true,
          data: newPermission,
          errorCode: '201',
          errorMessage: null,
          showType: 0,
        });
      })();
      return;

    case 'PUT':
      (() => {
        let newPermission = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === id) {
            newPermission = {
              ...item,
              name,
              slug,
              httpMethod,
              httpPath,
              desc,
              updatedAt: new Date(),
            };
            return { ...item, ...newPermission };
          }
          return item;
        });
        return res.status(201).json({
          success: true,
          data: newPermission,
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
  'GET /api/permission/query': getPermission,
  'GET /api/permission/show': showPermission,
  'POST /api/permission/create': postPermission,
  'DELETE /api/permission/remove': postPermission,
  'PUT /api/permission/update': postPermission,
};
