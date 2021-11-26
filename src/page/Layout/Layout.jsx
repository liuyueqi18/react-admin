import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  //   Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styles from "../../style/App.module.css";
import routesList from "../../routes/router";
import { Layout, Menu } from "antd";
import SiderLogo from "./SiderLogo";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function LayoutComponent() {
  useEffect(() => {
    handlerMenu();
    return () => {
      // end
    };
  }, []);
  const [state, setState] = useState({
    path: "",
  });
  let defaultOpenKeys = [];
  const loaction = useLocation();
  const nvigate = useNavigate();

  const handlerMenu = () => {
    getPathRoute(routesList, loaction.pathname);
    setState({
      path: loaction.pathname,
      defaultOpenKeys: defaultOpenKeys.reverse(),
    });
  };

  const getPathRoute = (tree, path) => {
    for (let index = 0; index < tree.length; index++) {
      if (tree[index].children) {
        let endRecursiveLoop = getPathRoute(tree[index].children, path);
        if (endRecursiveLoop) {
          defaultOpenKeys.push(tree[index].path);
          return true;
        }
      }
      if (tree[index].path === path) {
        defaultOpenKeys.push(tree[index].path);
        return true;
      }
    }
  };

  const handlerMenuItem = (value) => {
    nvigate(value.path);
  };
  const renderMenu = (list) => {
    list = list.filter((item) => !item.isPage);
    return list.map((item) => {
      if (item.children?.length) {
        return (
          <SubMenu key={item.path} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.path} onClick={() => handlerMenuItem(item)}>
            {/* <Link to={item.path}> */}
            <span>{item.title}</span>
            {/* </Link> */}
          </Menu.Item>
        );
      }
    });
  };
  const renderElementPage = (list) => {
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
    getNList(list);
    return nodeList.map((item) => {
      return (
        <Route
          key={item.path}
          path={item.path}
          element={<item.component />}
        ></Route>
      );
    });
  };
  const onSelect = (value) => {
    setState({
      ...state,
      path: value.selectedKeys[0],
    });
  };

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider}>
        <SiderLogo></SiderLogo>
        <Menu
          theme="dark"
          mode="inline"
          onSelect={onSelect}
          selectedKeys={[state.path]}
          defaultOpenKeys={defaultOpenKeys}
        >
          {renderMenu(routesList)}
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>头部</Header>
        <Content className={styles.content}>
          <Routes exact>{renderElementPage(routesList)}</Routes>
        </Content>
        {/* <Footer className={styles.footer}>底部区域</Footer> */}
      </Layout>
    </Layout>
  );
}
export default LayoutComponent;
