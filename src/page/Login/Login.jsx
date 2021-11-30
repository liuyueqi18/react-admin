import React from "react";
import styles from "../../styles/Login.module.css";

import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../service/login";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export default function Login() {
  const nvigate = useNavigate();
  const onFinish = (values) => {
    userLogin(values.username, values.password).then((res) => {
      localStorage.setItem("RYMUSERID", res.id);
      localStorage.setItem("USERINFO", JSON.stringify(res.attributes));
      nvigate("/home");
    });
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginContent}>
        <Form name="basic" size="large" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入您的用户/邮箱" }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入您的密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
