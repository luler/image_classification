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
        name: '图片管理',
        path: '/label/list/:id/image',
        component: './label/image',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/predict',
    name: '识别体验',
    icon: 'DatabaseOutlined',
    component: './label/predict',
  },
  {
    component: './404',
  },
];
