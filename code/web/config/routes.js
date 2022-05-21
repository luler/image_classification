export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/label/list',
  },
  {
    path: '/label',
    name: '图片类别管理',
    icon: 'DatabaseOutlined',
    routes: [
      {
        name: '类别列表',
        path: '/label/list',
        component: './label/label',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
