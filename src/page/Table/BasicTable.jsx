import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getCustomerListById, followCustomer } from "../../service/customer";
import { Table, Space, Button } from "antd";

function BasicTable() {
  const [state, setState] = useState({
    list: [],
    total: 0,
    queryParams: {
      globalQuery: "",
      custName: "",
      custPhone: "",
      gender: "",
    },
  });
  const [pageParams, setPageParams] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getTableList();
    return () => {
      //
    };
  }, [pageParams]);

  const handlerFollow = (item) => {
    followCustomer(item.id, !item.isFollow).then(() => {
      item.isFollow = !item.isFollow;
    });
  };

  const RYMUSERID = localStorage.getItem("RYMUSERID");
  const TabelColumns = [
    {
      title: "姓名",
      dataIndex: "custName",
      key: "custName",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (
        <Space size="middle">
          <span>{text === "1" ? "男" : "女"}</span>
        </Space>
      ),
    },
    {
      title: "电话",
      dataIndex: "custPhone",
      key: "custPhone",
    },
    {
      title: "省份",
      dataIndex: "provinceName",
      key: "provinceName",
    },
    {
      title: "城市",
      dataIndex: "cityName",
      key: "cityName",
    },
    {
      title: "区/县",
      dataIndex: "areaName",
      key: "areaName",
    },
    {
      title: "关注",
      dataIndex: "isFollow",
      render: (isFollow, row) => (
        <Space size="middle">
          <Button
            type="primary"
            danger={isFollow}
            onClick={() => handlerFollow(row)}
          >
            {isFollow ? "取关" : "关注"}
          </Button>
        </Space>
      ),
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "创建时间",
      dataIndex: "createdTime",
      key: "createdTime",
      width: 180,
    },
    {
      title: "最近更新时间",
      dataIndex: "updatedTime",
      key: "updatedTime",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 180,
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">编辑</Button>
          <Button type="primary" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const getTableList = () => {
    getCustomerListById(RYMUSERID, pageParams, state.queryParams).then(
      (res) => {
        setState({
          ...state,
          list: res[0].map((item, index) => {
            return {
              ...item,
              key: dayjs().valueOf() + index,
            };
          }),
          total: res[1],
        });
      }
    );
  };
  const pageChange = (current, pageSize) => {
    setPageParams({
      current: current,
      pageSize: pageSize,
    });
  };
  return (
    <div>
      {state.total}
      <Table
        dataSource={state.list}
        columns={TabelColumns}
        bordered
        scroll={{ x: 1200 }}
        pagination={{
          current: pageParams.current,
          showTotal: () => `总计: ${state.total} 条`,
          showSizeChanger: true,
          total: state.total,
          onChange: pageChange,
        }}
      />
    </div>
  );
}
export default BasicTable;
