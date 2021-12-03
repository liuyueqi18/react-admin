import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Popconfirm, Row, Select, Space } from "antd";

import styles from "../../styles/Table/BasicTable.module.css";

const GenderLT = [
  { value: "1", label: "男" },
  { value: "2", label: "女" },
];

function BasicTableSearch(props) {
  const onFinish = (values) => {
    const params = { ...values };
    props.pushSearchParams(params);
  };
  const createdRandom = () => {
    props.createdRandom();
  };
  return (
    <div className={styles.search}>
      <Form
        size="large"
        onFinish={onFinish}
        labelCol={{ style: { width: 100 } }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="姓名" name="custName">
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="手机号" name="custPhone">
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="性别" name="gender">
              <Select allowClear>
                {GenderLT.map((item) => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="关键字" name="globalQuery">
              <Input allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8} offset={16}>
            <Form.Item>
              <div className={styles.search_button}>
                <Space wrap>
                  <Button type="primary" htmlType="button">
                    创建人员
                  </Button>
                  <Popconfirm
                    placement="leftTop"
                    title={"请确认是否创建10条随机的人员"}
                    onConfirm={createdRandom}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button type="primary" htmlType="button">
                      创建随机人员
                    </Button>
                  </Popconfirm>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button htmlType="reset">清空</Button>
                </Space>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default BasicTableSearch;
