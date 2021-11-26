import React from "react";
import styles from "../../styles/Login.module.css";

import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nvigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    nvigate("/home");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className={styles.login}>
      <div className={styles.loginContent}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户/邮箱"
            name="username"
            rules={[{ required: true, message: "请输入您的用户/邮箱" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入您的密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
