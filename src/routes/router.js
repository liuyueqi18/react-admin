import Home from "../page/Home/Home";
import Menu11 from "../page/Page/Menu11";
import Menu12 from "../page/Page/Menu12";
import Menu2 from "../page/Page/Menu2";
import NotFound from "../page/NotFound/index";
const routes = [
  {
    path: "/",
    component: Home,
    isPage: true,
    requiresAuth: true,
  },
  {
    path: "/home",
    title: "首页",
    component: Home,
    requiresAuth: true,
  },
  {
    path: "/menu",
    title: "路由嵌套",
    children: [
      {
        path: "/menu/menu1",
        title: "菜单1",
        requiresAuth: true,
        children: [
          {
            path: "/menu/menu1/menu1-1",
            component: Menu11,
            title: "菜单1-1",
            requiresAuth: true,
          },
          {
            path: "/menu/menu1/menu1-2",
            component: Menu12,
            title: "菜单1-2",
            requiresAuth: true,
          },
        ],
      },
      {
        path: "/menu/menu2",
        component: Menu2,
        title: "菜单2",
        requiresAuth: true,
      },
    ],
  },
  {
    path: "*",
    component: NotFound,
    requiresAuth: false,
    isPage: true,
  },
];

export default routes;
