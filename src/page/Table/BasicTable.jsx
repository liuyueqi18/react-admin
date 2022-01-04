import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getCustomerListById,
  followCustomer,
  saveAllCustomer,
  delCustomer,
  setCustomer,
  getCustomerInfoById,
  editCustomer,
} from "../../service/customer";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
} from "antd";
import BasicTableSearch from "./BasicTableSearch";
import {
  getRandomMoble,
  queryRegion,
  randomName,
  randomNum,
} from "../../service/utils";

const { Option } = Select;

function BasicTable() {
  const [state, setState] = useState({
    list: [],
    total: 0,
  });
  const [customerForm] = Form.useForm();
  const [customerState, setCustomerState] = useState({
    rawItem: {},
    provinceList: [],
    cityList: [],
    areaList: [],
  });
  const [customerVisible, setCustomerVisible] = useState(false);
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
      render: (text, row) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handlerEdit(row)}>
            编辑
          </Button>
          <Button type="primary" danger onClick={() => handlerDelete(row)}>
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

  /**
   * 关注/取关
   * @param {*} item
   */
  const handlerFollow = (item) => {
    followCustomer(item.id, !item.isFollow).then(() => {
      item.isFollow = !item.isFollow;
    });
  };

  // 更新列表
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
  // 页数/页码
  const pageChange = (current, pageSize) => {
    setPageParams({
      current: current,
      pageSize: pageSize,
    });
  };
  // 搜索
  const pushSearchParams = (values) => {
    setQueryParams({
      ...values,
    });
  };
  // 创建随机人员10条
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
  // 创建随机人员单条
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
  // 删除
  const handlerDelete = (row) => {
    Modal.confirm({
      title: "提示",
      content: `是否删除此条数据`,
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        delCustomer(row.id).then((res) => {
          getTableList();
        });
      },
    });
  };
  // 弹窗显示
  const setCustomerModal = (flag) => {
    setCustomerVisible(flag);
    if (flag === false) {
      customerForm.resetFields();
      setCustomerState({
        ...customerState,
        rawItem: {},
      });
    }
  };
  // 新增
  const createPerson = () => {
    queryRegion().then((res) => {
      setCustomerState({ ...customerState, provinceList: res, rawItem: {} });
      setCustomerModal(true);
    });
  };
  const onChangeSelect = (t, e) => {
    if (t === "province") {
      queryRegion(e).then((res) => {
        customerForm.setFieldsValue({
          city: "",
          area: "",
        });
        setCustomerState({ ...customerState, cityList: res });
      });
    } else if (t === "city") {
      queryRegion(e).then((res) => {
        customerForm.setFieldsValue({
          area: "",
        });
        setCustomerState({ ...customerState, areaList: res });
      });
    } else if (t === "area") {
      //
    }
  };
  // 编辑按钮
  const handlerEdit = (row) => {
    getCustomerInfoById(row.id).then((res) => {
      Promise.all([
        queryRegion(),
        queryRegion(res.provinceCode),
        queryRegion(res.cityCode),
      ])
        .then((p) => {
          setCustomerState({
            provinceList: p?.[0] ?? [],
            cityList: p?.[1] ?? [],
            areaList: p?.[2] ?? [],
            rawItem: { ...res },
          });
          customerForm.setFieldsValue({
            id: res.id,
            name: res.custName,
            phone: res.custPhone,
            province: res.provinceCode,
            city: res.cityCode,
            area: res.areaCode,
            gender: res.gender,
            remark: res.remark,
          });
        })
        .finally(() => {
          setCustomerModal(true);
        });
    });
  };
  // 保存
  const handlerSetCustomer = () => {
    const params = {
      userId: localStorage.getItem("RYMUSERID"),
      custPhone: customerForm.getFieldsValue()?.phone,
      custName: customerForm.getFieldsValue()?.name,
      provinceName: customerState.provinceList.find(
        (item) => item.code === customerForm.getFieldsValue()?.province
      )?.name,
      provinceCode: customerForm.getFieldsValue()?.province,
      cityName: customerState.cityList.find(
        (item) => item.code === customerForm.getFieldsValue()?.city
      )?.name,
      cityCode: customerForm.getFieldsValue()?.city,
      areaName: customerState.areaList.find(
        (item) => item.code === customerForm.getFieldsValue()?.area
      )?.name,
      areaCode: customerForm.getFieldsValue()?.area,
      remark: customerForm.getFieldsValue()?.remark,
      gender: customerForm.getFieldsValue()?.gender,
    };
    if (customerState.rawItem?.id) {
      customerForm
        .validateFields()
        .then(() => {
          editCustomer(customerState.rawItem.id, params).then(() => {
            getTableList();
            setCustomerModal(false);
          });
        })
        .catch((errorInfo) => {
          console.log("errorInfo :>> ", errorInfo);
        });
    } else {
      customerForm
        .validateFields()
        .then(() => {
          setCustomer(params).then(() => {
            getTableList();
            setCustomerModal(false);
          });
        })
        .catch((errorInfo) => {
          console.log("errorInfo :>> ", errorInfo);
        });
    }
  };

  return (
    <div>
      <BasicTableSearch
        text="搜索部分"
        pushSearchParams={pushSearchParams}
        createdRandom={createdRandom}
        createPerson={createPerson}
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
      <Modal
        title="人员详情"
        centered
        destroyOnClose
        visible={customerVisible}
        width={800}
        onOk={() => handlerSetCustomer()}
        onCancel={() => setCustomerModal(false)}
      >
        <Form form={customerForm} labelCol={{ style: { width: 60 } }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[{ required: true, max: 11 }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  showSearch
                  onChange={(e) => onChangeSelect("province", e)}
                >
                  {customerState.provinceList.map((item, index) => {
                    return (
                      <Option value={item.code} key={index + "p"}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="市级" rules={[{ required: true }]}>
                <Select
                  allowClear
                  showSearch
                  onChange={(e) => onChangeSelect("city", e)}
                >
                  {customerState.cityList.map((item, index) => {
                    return (
                      <Option value={item.code} key={index + "c"}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="区县" rules={[{ required: true }]}>
                <Select
                  allowClear
                  showSearch
                  onChange={(e) => onChangeSelect("area", e)}
                >
                  {customerState.areaList.map((item, index) => {
                    return (
                      <Option value={item.code} key={index + "a"}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea showCount maxLength={200} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default BasicTable;
