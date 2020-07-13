// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
// eslint-disable-next-line
import mockjs from 'mockjs';
import { parse } from 'url';
import { TableListItem, TableListParams } from '@/services/logs.d';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index.toString(),
      name: mockjs.Random.name(),
      method: [mockjs.Random.pick(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])],
      path: mockjs.Random.url().split(':/')[1],
      input: '{}',
      ip: mockjs.Random.ip(),
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }

  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getLogs(req: Request, res: Response, u: string) {
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

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
  }

  if (params.path) {
    dataSource = dataSource.filter((data) => data.path.includes(params.path || ''));
  }

  if (params.ip) {
    dataSource = dataSource.filter((data) => data.ip?.includes(params.ip || ''));
  }

  if (params.method) {
    if (typeof params.method === 'string') {
      params.method = [params.method];
    }
    dataSource = dataSource.filter(
      (data) => (params.method?.filter((item) => data.method.includes(item)) || []).length > 0,
    );
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

function postLogs(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { method } = req;

  const body = (b && b.body) || req.body;
  const { id } = body;

  switch (method) {
    case 'DELETE':
      (() => {
        tableListDataSource = tableListDataSource.filter((item) => id.indexOf(item.id) === -1);
        return res.status(204).send();
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
  'GET /api/logs/query': getLogs,
  'DELETE /api/logs/remove': postLogs,
};
