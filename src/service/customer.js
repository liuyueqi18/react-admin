import { message } from "antd";
import dayjs from "dayjs";
import AV from "leancloud-storage";

AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://server.lyq168.cn",
});

/**
 * 获取人员列表
 * @param {*} userId
 * @param {*} pageParams
 * @param {*} queryParams
 * @returns
 */
export function getCustomerListById(userId, pageParams, queryParams) {
  // 只查看自己的人员
  const CustomerUserVO = new AV.Query("Customer");
  CustomerUserVO.equalTo("userId", userId);
  // 全局查询条件
  const globalQueryV1 = new AV.Query("Customer");
  const globalQueryV2 = new AV.Query("Customer");
  const globalQueryV3 = new AV.Query("Customer");
  const globalQueryV4 = new AV.Query("Customer");
  const globalQueryV5 = new AV.Query("Customer");
  const globalQueryV6 = new AV.Query("Customer");
  if (queryParams.globalQuery) {
    globalQueryV1.contains("custName", queryParams.globalQuery);
    globalQueryV2.contains("provinceName", queryParams.globalQuery);
    globalQueryV3.contains("cityName", queryParams.globalQuery);
    globalQueryV4.contains("areaName", queryParams.globalQuery);
    globalQueryV5.contains("remark", queryParams.globalQuery);
    globalQueryV6.contains("custPhone", queryParams.globalQuery);
  }
  const CustomerQueryV1 = new AV.Query("Customer");
  const CustomerQueryV2 = new AV.Query("Customer");
  if (queryParams?.custName) {
    CustomerQueryV1.equalTo("custName", queryParams.custName);
  }
  if (queryParams.custPhone) {
    CustomerQueryV1.equalTo("custPhone", queryParams.custPhone);
  }
  if (queryParams.gender) {
    CustomerQueryV1.equalTo("gender", queryParams.gender);
  }
  const globalQueryAV = AV.Query.or(
    globalQueryV1,
    globalQueryV2,
    globalQueryV3,
    globalQueryV4,
    globalQueryV5,
    globalQueryV6
  );
  const CustomerQuery = AV.Query.and(CustomerQueryV1, CustomerQueryV2);
  const Query = AV.Query.and(CustomerUserVO, CustomerQuery, globalQueryAV);
  Query.limit(pageParams.pageSize);
  Query.skip((pageParams.current - 1) * pageParams.pageSize);
  Query.addDescending("createdAt");
  const listPromise = new Promise((resolve, reject) => {
    Query.find()
      .then((res) => {
        const list = res.map((item) => {
          return {
            id: item.id,
            userId: item.get("userId"),
            custName: item.get("custName"),
            custPhone: item.get("custPhone"),
            isFollow: item.get("isFollow"),
            provinceName: item.get("provinceName"),
            cityName: item.get("cityName"),
            areaName: item.get("areaName"),
            remark: item.get("remark"),
            gender: item.get("gender"),
            createdTime: dayjs(item.get("createdAt")).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            updatedTime: dayjs(item.get("updatedAt")).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          };
        });
        resolve(list);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
  const countPromise = new Promise((resolve, reject) => {
    Query.count()
      .then((count) => {
        resolve(count);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
  return Promise.all([listPromise, countPromise]);
}

/**
 * 关注/取关
 * @param {*} custId
 * @param {*} isFollow
 * @returns
 */
export function followCustomer(custId, isFollow) {
  return new Promise((resolve, reject) => {
    const customer = AV.Object.createWithoutData("Customer", custId);
    customer.set("isFollow", isFollow);
    customer
      .save()
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
}

/**
 * 新增大批量用户
 * @param {*} list
 * @returns
 */
export function saveAllCustomer(list) {
  return new Promise((resolve, reject) => {
    const objects = list.map((item) => {
      const object = new AV.Object("Customer");
      for (var i in item) {
        object.set(i, item[i]);
      }
      return object;
    });
    AV.Object.saveAll(objects)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
}

/**
 * 删除人员
 * @param {*} userId
 * @returns
 */
export function delCustomer(userId) {
  return new Promise((resolve, reject) => {
    const customer = AV.Object.createWithoutData("Customer", userId);
    customer
      .destroy()
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
}

/**
 * 保存人员
 * @param {*} info
 * @returns
 */
export function setCustomer(info) {
  return new Promise((resolve, reject) => {
    const Customer = AV.Object.extend("Customer");
    const customer = new Customer();
    for (const i in info) {
      customer.set(i, info[i]);
    }
    customer
      .save()
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
}

/**
 * 获取人员详情
 * @param {*} id
 * @returns
 */
export function getCustomerInfoById(id) {
  return new Promise((resolve, reject) => {
    const customerInfo = new AV.Query("Customer");
    customerInfo
      .get(id)
      .then((res) => {
        resolve({
          id: res.get("objectId"),
          userId: res.get("userId"),
          custPhone: res.get("custPhone"),
          custName: res.get("custName"),
          provinceName: res.get("provinceName"),
          provinceCode: res.get("provinceCode"),
          cityName: res.get("cityName"),
          cityCode: res.get("cityCode"),
          areaName: res.get("areaName"),
          areaCode: res.get("areaCode"),
          remark: res.get("remark"),
          gender: res.get("gender"),
        });
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
}

/**
 * 编辑人员
 * @param {*} id
 * @param {*} info
 * @returns
 */
export function editCustomer(id, info) {
  return new Promise((resolve, reject) => {
    const CustomerInfo = AV.Object.createWithoutData("Customer", id);
    for (const i in info) {
      CustomerInfo.set(i, info[i]);
    }
    CustomerInfo.save()
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
}
