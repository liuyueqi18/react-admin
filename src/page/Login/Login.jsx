import React, { useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";

import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { userLogin, userRegister } from "../../service/login";

import UserImg from "../../image/login/user.png";
import PasswordImg from "../../image/login/password.png";
import EmailImg from "../../image/login/email.png";
import CloseImg from "../../image/login/close.png";
import OpenImg from "../../image/login/open.png";
import { CheckEmail, CheckPassWord, CheckUserName } from "../../service/utils";

export default function Login() {
  const [state, setstate] = useState({
    loginType: "login", // login 或者 register
    username: "",
    password: "",
    email: "",
    passType: "password", // password 或者 text
    loading: false,
  });
  const nvigate = useNavigate();

  useEffect(() => {
    //
    return () => {
      setstate(false);
    };
  }, []);

  const handlerEyes = (type) => {
    if (type === "open") {
      setstate({ ...state, passType: "text" });
    } else if (type === "close") {
      setstate({ ...state, passType: "password" });
    }
  };

  const handlerInput = (e, t) => {
    const nstate = { ...state };
    nstate[t] = e.target.value;
    setstate({ ...nstate });
  };

  const handlerlogin = () => {
    if (!CheckUserName(state.username) && !CheckEmail(state.username)) {
      message.error("请输入2-10位中文名字或者邮箱");
      return;
    }
    if (!CheckPassWord(state.password)) {
      message.error("请输入密码");
      return;
    }
    setstate({ ...state, loading: true });

    userLogin(state.username, state.password).then((res) => {
      localStorage.setItem("RYMUSERID", res.id);
      localStorage.setItem("USERINFO", JSON.stringify(res.attributes));
      nvigate("/home");
      setstate({ ...state, loading: false });
    });
  };

  const changeLoginType = (type) => {
    setstate({ ...state, loginType: type });
  };

  const handlerRegister = () => {
    if (!CheckUserName(state.username)) {
      message.error("请输入2-10位中文名字");
      return;
    }
    if (!CheckEmail(state.email)) {
      message.error("请输入合法邮箱");
      return;
    }
    if (!CheckPassWord(state.password)) {
      message.error("请输入密码");
      return;
    }
    state.isShowOverlay = true;
    userRegister(state.username, state.email, state.password)
      .then((res) => {
        localStorage.setItem("RYMUSERID", res.id);
        localStorage.setItem("USERINFO", JSON.stringify(res.attributes));
        nvigate("/home");
        setstate({ ...state, loading: false });
      })
      .catch((error) => {
        setstate({ ...state, loading: false });
      });
  };

  // TODO
  const handlerReset = () => {
    //
  };
  return (
    <div className={styles.login}>
      <div className={styles.login_content}>
        <div className={styles.input_centent}>
          <input
            className={styles.input_class}
            type="text"
            placeholder="请输入用户名或邮箱"
            onChange={(e) => handlerInput(e, "username")}
          />
          <img src={UserImg} alt="" className={styles.input_icon} />
        </div>
        <div className={styles.input_centent}>
          <input
            className={styles.input_class}
            type={state.passType}
            onChange={(e) => handlerInput(e, "password")}
            placeholder="请输入密码"
          />
          <img src={PasswordImg} alt="" className={styles.input_icon} />
          {state.passType === "password" ? (
            <img
              src={CloseImg}
              alt=""
              onClick={() => handlerEyes("open")}
              className={styles.input_icon_right}
            />
          ) : (
            <img
              src={OpenImg}
              alt=""
              onClick={() => handlerEyes("close")}
              className={styles.input_icon_right}
            />
          )}
        </div>
        {state.loginType === "register" ? (
          <div className={styles.input_centent}>
            <input
              className={styles.input_class}
              type="email"
              placeholder="请输入邮箱"
              onChange={(e) => handlerInput(e, "email")}
            />
            <img src={EmailImg} alt="" className={styles.input_icon} />
          </div>
        ) : (
          ""
        )}
        {state.loginType === "login" ? (
          <Button
            block
            size="large"
            loading={state.loading}
            type="primary"
            onClick={handlerlogin}
          >
            登 录
          </Button>
        ) : (
          <Button
            block
            size="large"
            loading={state.loading}
            type="primary"
            onClick={handlerRegister}
          >
            注 册
          </Button>
        )}
        {state.loginType === "login" ? (
          <div className={styles.tip_box}>
            <span
              className={styles.tips}
              onClick={() => changeLoginType("register")}
            >
              注册账号
            </span>
            {/* <span className={styles.tips} onClick={handlerReset}>
              忘记密码
            </span> */}
          </div>
        ) : (
          <div className={styles.tip_box}>
            <span
              className={styles.tips}
              onClick={() => changeLoginType("login")}
            >
              回到登录
            </span>
          </div>
        )}
        {/* <Form
          name="basic"
          size="large"
          onFinish={onFinish}
          autoComplete="false"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入您的用户/邮箱" }]}
          >
            <Input
              autoComplete="false"
              bordered={false}
              prefix={<UserOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入您的密码" }]}
          >
            <Input.Password
              autoComplete="false"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form> */}
      </div>
    </div>
  );
}
