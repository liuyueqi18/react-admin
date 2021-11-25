import Home from "../page/Home/Home";
import Page111 from "../page/Page/Page1_1_1";
import Page112 from "../page/Page/Page1_1_2";
import Page12 from "../page/Page/Page1_2";
import Page2 from "../page/Page/Page2";
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
    title: "Home",
    component: Home,
    requiresAuth: true,
  },
  {
    path: "/page1",
    title: "Page1",
    children: [
      {
        path: "/page1/page11",
        title: "Page1_1",
        requiresAuth: true,
        children: [
          {
            path: "/page1/page11/page111",
            component: Page111,
            title: "Page1_1_1",
            requiresAuth: true,
          },
          {
            path: "/page1/page11/page112",
            component: Page112,
            title: "Page1_1_2",
            requiresAuth: true,
          },
        ],
      },
      {
        path: "/page1/page12",
        component: Page12,
        title: "Page1_2",
        requiresAuth: true,
      },
    ],
  },
  {
    path: "/page2",
    title: "page2",
    component: Page2,
    requiresAuth: true,
  },
  {
    path: "*",
    component: NotFound,
    requiresAuth: false,
    isPage: true,
  },
];

export default routes;
