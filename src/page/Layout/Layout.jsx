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

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function LayoutComponent() {
  useEffect(() => {
    handlerMenu();
    return () => {
      //
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [state, setState] = useState({
    path: "",
    defaultOpenKeys: [],
  });
  const loaction = useLocation();
  const nvigate = useNavigate();
  const handlerMenu = () => {
    setState({ path: loaction.pathname });
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
      path: value.selectedKeys[0],
    });
    console.log("value :>> ", value);
  };

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider}>
        <Menu
          theme="dark"
          mode="inline"
          onSelect={onSelect}
          selectedKeys={[state.path]}
          defaultOpenKeys={state.defaultOpenKeys}
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
