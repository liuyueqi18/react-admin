import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutComponent from "./page/Layout/Layout";
import Login from "./page/Login/Login";
import routesList from "./routes/router";

function App() {
  const loaction = useLocation();
  const nvigate = useNavigate();
  useEffect(() => {
    handlerLogin();
    return () => {
      //
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
      {loaction.pathname === "/login" ? (
        <Login></Login>
      ) : (
        <LayoutComponent></LayoutComponent>
      )}
    </div>
  );
}
export default App;
