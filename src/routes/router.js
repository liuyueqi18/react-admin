import { lazy } from "react";

const routes = [
  {
    path: "/",
    component: lazy(() => import("../page/Home/Home")),
    isPage: true,
    requiresAuth: true,
  },
  {
    path: "/login",
    component: lazy(() => import("../page/Login/Login")),
    isPage: true,
    requiresAuth: false,
    title: "登录",
  },
  {
    path: "/personalCenter",
    title: "个人中心",
    component: lazy(() => import("../page/PersonalCenter/PersonalCenter")),
    requiresAuth: true,
    isPage: true,
  },
  {
    path: "/home",
    title: "首页",
    component: lazy(() => import("../page/Home/Home")),
    requiresAuth: true,
    icon: "HomeOutlined",
  },
  {
    path: "/table",
    title: "表格",
    icon: "DatabaseOutlined",
    children: [
      {
        path: "/table/basic-table",
        component: lazy(() => import("../page/Table/BasicTable")),
        title: "基础表格",
        requiresAuth: true,
      },
    ],
  },
  {
    path: "/menu",
    title: "路由嵌套",
    icon: "SwitcherOutlined",
    children: [
      {
        path: "/menu/menu1",
        title: "菜单1",
        requiresAuth: true,
        children: [
          {
            path: "/menu/menu1/menu1-1",
            component: lazy(() => import("../page/Page/Menu11")),
            title: "菜单1-1",
            requiresAuth: true,
          },
          {
            path: "/menu/menu1/menu1-2",
            component: lazy(() => import("../page/Page/Menu12")),
            title: "菜单1-2",
            requiresAuth: true,
          },
        ],
      },
      {
        path: "/menu/menu2",
        component: lazy(() => import("../page/Page/Menu2")),
        title: "菜单2",
        requiresAuth: true,
      },
    ],
  },
  {
    path: "*",
    component: lazy(() => import("../page/NotFound/index")),
    requiresAuth: false,
    isPage: true,
  },
];

export default routes;
