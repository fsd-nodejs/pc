import { Request, Response } from 'express';

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

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        success: true,
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        showType: 0,
      });
      return;
    }
    res.send({
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
      res.send({
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
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.send({
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
      res.send({
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

    res.send({
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
    res.send({
      success: true,
      data: {},
      errorCode: '200',
      errorMessage: null,
      showType: 0,
    });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({
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
    res.status(500).send({
      success: false,
      data: null,
      errorCode: 500,
      errorMessage: 'error',
      showType: 2,
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      success: true,
      data: null,
      errorCode: 404,
      errorMessage: 'Not Found',
      showType: 2,
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      success: true,
      data: null,
      errorCode: 403,
      errorMessage: 'No Permission',
      showType: 2,
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      success: true,
      data: null,
      errorCode: 401,
      errorMessage: 'Unauthorized',
      showType: 2,
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
