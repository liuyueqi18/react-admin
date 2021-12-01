import React, { useState, useEffect, Suspense } from "react";
import {
  Route,
  Routes,
  //   Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styles from "../../styles/App.module.css";
import routesList from "../../routes/router";
import { Breadcrumb, Layout, Menu, Skeleton } from "antd";
import SiderLogo from "./SiderLogo";
import * as Icon from "@ant-design/icons";
import HeaderRight from "./HeaderRight";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function LayoutComponent() {
  const [state, setState] = useState({
    path: "",
    breadcrumbKeys: [],
  });
  let defaultOpenKeys = [];
  let breadcrumbKeys = [];
  const loaction = useLocation();
  const nvigate = useNavigate();

  useEffect(() => {
    handlerMenu();
    return () => {
      // end
    };
  }, [loaction.pathname]);

  const handlerMenu = () => {
    getPathRoute(routesList, loaction.pathname);
    setState({
      path: loaction.pathname,
      breadcrumbKeys: breadcrumbKeys.reverse(),
    });
  };

  const getPathRoute = (tree, path) => {
    for (let index = 0; index < tree.length; index++) {
      if (tree[index].children) {
        let endRecursiveLoop = getPathRoute(tree[index].children, path);
        if (endRecursiveLoop) {
          defaultOpenKeys.push(tree[index].path);
          breadcrumbKeys.push(tree[index]);
          return true;
        }
      }
      if (tree[index].path === path) {
        defaultOpenKeys.push(tree[index].path);
        breadcrumbKeys.push(tree[index]);
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
          <SubMenu
            key={item.path}
            title={
              <div>
                {item.icon
                  ? React.createElement(Icon[item.icon], {
                      style: {
                        fontSize: "16px",
                        color: state.path === item.path ? "#fff" : "#08c",
                      },
                    })
                  : ""}
                <span>{item.title}</span>
              </div>
            }
          >
            {renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.path} onClick={() => handlerMenuItem(item)}>
            {
              <div>
                {item.icon
                  ? React.createElement(Icon[item.icon], {
                      style: {
                        fontSize: "16px",
                        color: state.path === item.path ? "#fff" : "#08c",
                      },
                    })
                  : ""}
                <span>{item.title}</span>
              </div>
            }
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
    breadcrumbKeys = [];
    getPathRoute(routesList, loaction.pathname);
    setState({
      path: value.selectedKeys[0],
      breadcrumbKeys: breadcrumbKeys.reverse(),
    });
  };

  const renderLoading = (
    <div>
      <Skeleton active />
    </div>
  );

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
        <Header className={styles.header}>
          <Breadcrumb>
            {state.breadcrumbKeys.map((item, index) => {
              return (
                <Breadcrumb.Item key={index}>{item.title}</Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <HeaderRight></HeaderRight>
        </Header>
        <Content className={styles.content}>
          <Suspense fallback={renderLoading} maxDuration={500}>
            <Routes exact>{renderElementPage(routesList)}</Routes>
          </Suspense>
        </Content>
        {/* <Footer className={styles.footer}>底部区域</Footer> */}
      </Layout>
    </Layout>
  );
}
export default LayoutComponent;
