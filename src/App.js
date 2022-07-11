import { ConfigProvider } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutComponent from "./page/Layout/Layout";
import Login from "./page/Login/Login";
import routesList from "./routes/router";
import zhCN from "antd/lib/locale/zh_CN";

function App() {
  const loaction = useLocation();
  const nvigate = useNavigate();
  useEffect(() => {
    handlerLogin();
    return () => {
      // Nothing...
    };
  }, [loaction.pathname]);
  const RYMUSERID = localStorage.getItem("RYMUSERID");

  const handlerLogin = () => {
    let nodeList = [];
    let getNList = (list) => {
      list.forEach((item) => {
        if (item.children?.length) {
          getNList(item.children);
        } else {
          nodeList.push(item);
        }
      });
    };
    getNList(routesList);
    const routerItem = nodeList.find((item) => item.path === loaction.pathname);
    document.title = routerItem?.title || "React-Admin";
    if (loaction.pathname === "/login") {
      // 已经在登录页不在跳转
      return;
    } else {
      if (routerItem?.requiresAuth) {
        if (RYMUSERID) {
          // 如有TOKEN不在跳转
        } else {
          nvigate("/login");
          return;
        }
      }
    }
  };

  return (
    <div>
      <ConfigProvider locale={zhCN}>
        {loaction.pathname === "/login" ? (
          <Login></Login>
        ) : (
          <LayoutComponent></LayoutComponent>
        )}
      </ConfigProvider>
    </div>
  );
}
export default App;
