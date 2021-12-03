import React, { useEffect, useState, createContext } from "react";
import dayjs from "dayjs";
import {
  getCustomerListById,
  followCustomer,
  saveAllCustomer,
} from "../../service/customer";
import { Table, Space, Button } from "antd";
import BasicTableSearch from "./BasicTableSearch";
import {
  getRandomMoble,
  queryRegion,
  randomName,
  randomNum,
} from "../../service/utils";

function BasicTable() {
  const [state, setState] = useState({
    list: [],
    total: 0,
  });
  const [pageParams, setPageParams] = useState({
    current: 1,
    pageSize: 10,
  });
  const [queryParams, setQueryParams] = useState({
    globalQuery: "",
    custName: "",
    custPhone: "",
    gender: "",
  });

  const RYMUSERID = localStorage.getItem("RYMUSERID");
  const TabelColumns = [
    {
      title: "姓名",
      dataIndex: "custName",
      key: "custName",
      width: 120,
      align: "center",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      width: 50,
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
      align: "center",
      width: 100,
    },
    {
      title: "省份",
      dataIndex: "provinceName",
      key: "provinceName",
      align: "center",
      width: 90,
    },
    {
      title: "城市",
      dataIndex: "cityName",
      key: "cityName",
      align: "center",
      width: 110,
    },
    {
      title: "区/县",
      dataIndex: "areaName",
      key: "areaName",
      align: "center",
      width: 110,
    },
    {
      title: "关注",
      dataIndex: "isFollow",
      align: "center",
      width: 110,
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
      align: "center",
      width: 130,
      render: (remark) => <Space size="middle">{remark || "暂无备注"}</Space>,
    },
    {
      title: "创建时间",
      dataIndex: "createdTime",
      key: "createdTime",
      align: "center",
      width: 180,
    },
    {
      title: "最近更新时间",
      dataIndex: "updatedTime",
      key: "updatedTime",
      align: "center",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      align: "center",
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

  useEffect(() => {
    getTableList();
    return () => {
      //
    };
  }, [pageParams, queryParams]);

  const handlerFollow = (item) => {
    followCustomer(item.id, !item.isFollow).then(() => {
      item.isFollow = !item.isFollow;
    });
  };

  const getTableList = () => {
    getCustomerListById(RYMUSERID, pageParams, queryParams).then((res) => {
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
    });
  };
  const pageChange = (current, pageSize) => {
    setPageParams({
      current: current,
      pageSize: pageSize,
    });
  };

  const pushSearchParams = (values) => {
    setQueryParams({
      ...values,
    });
  };

  const createdRandom = () => {
    if (!localStorage.getItem("RYMUSERID")) {
      return;
    }
    Promise.all([...new Array(10)].map((i) => getRandomPerson())).then(
      (list) => {
        saveAllCustomer(list).then(() => {
          getTableList();
        });
      }
    );
  };

  const getRandomPerson = async () => {
    let person = {
      userId: localStorage.getItem("RYMUSERID"),
      custPhone: getRandomMoble(),
      custName:
        Math.random() > 0.5
          ? randomName.getNickName()
          : randomName.getRandomName(),
      provinceName: "",
      provinceCode: "",
      cityName: "",
      cityCode: "",
      areaName: "",
      areaCode: "",
      remark: "",
      gender: randomNum(1, 2).toString(),
    };
    let pItem = {};
    let cItem = {};
    let aItem = {};
    const res1 = await queryRegion();
    pItem = res1[randomNum(0, res1?.length - 1)];
    person.provinceName = pItem?.name;
    person.provinceCode = pItem?.code;
    const res2 = await queryRegion(pItem.code);
    cItem = res2[randomNum(0, res2?.length - 1)];
    person.cityName = cItem?.name;
    person.cityCode = cItem?.code;
    if (cItem?.code) {
      const res3 = await queryRegion(cItem.code);
      if (res3?.length) {
        aItem = res3[randomNum(0, res3?.length - 1)];
        person.areaName = aItem?.name;
        person.areaCode = aItem?.code;
      }
    }
    return person;
  };

  return (
    <div>
      <BasicTableSearch
        text="搜索部分"
        pushSearchParams={pushSearchParams}
        createdRandom={createdRandom}
      />
      <Table
        dataSource={state.list}
        columns={TabelColumns}
        bordered
        scroll={{ x: 2000 }}
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
