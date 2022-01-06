import React, { useEffect, useState } from "react";

import { CaretDownOutlined } from "@ant-design/icons";
import styles from "../../styles/App.module.css";
import { Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";

function HeaderRight() {
  useEffect(() => {
    getUserInfo();
    return () => {
      //
    };
  }, []);
  const navigate = useNavigate();
  const [state, setstate] = useState({
    username: "",
  });
  const getUserInfo = () => {
    setstate({
      ...state,
      username: JSON.parse(localStorage.getItem("USERINFO"))?.username ?? "",
    });
  };
  const handlerMenuItem = (type) => {
    if (type === 0) {
      navigate("/personalCenter");
    } else if (type === 1) {
      navigate("/home");
    } else if (type === 2) {
      window.open("https://github.com/liuyueqi18/react-admin");
    } else if (type === 4) {
      localStorage.clear();
      navigate("/login");
    }
  };
  /**
   * +key是因为有bug
   * 按理说应该已经修复了 但还是会出现报错
   * ERROR MenuItem should not leave undefined `key`.
   * */
  const renderHeaderMenu = () => {
    const menuList = ["个人中心", "首页", "项目地址", "", "退出登录"];
    return (
      <Menu>
        {menuList.map((item, index) => {
          if (item !== "") {
            return (
              <Menu.Item key={`header-menu-item-${index}`}>
                <span
                  className={styles.headerMenuItem}
                  onClick={() => handlerMenuItem(index)}
                >
                  {item}
                </span>
              </Menu.Item>
            );
          } else {
            return <Menu.Divider key={`header-menu-divider-${index}`} />;
          }
        })}
      </Menu>
    );
  };

  return (
    <div className={styles.headerRightStyle}>
      <Dropdown overlay={renderHeaderMenu} placement="bottomRight" arrow>
        <div className={styles.headerRightBox}>
          <div className={styles.headerAvatar}>{state.username[0] ?? ""}</div>
          <CaretDownOutlined className={styles.headerAvatarIcon} />
        </div>
      </Dropdown>
    </div>
  );
}

export default HeaderRight;
