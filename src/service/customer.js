import { message } from "antd";
import dayjs from "dayjs";
import AV from "leancloud-storage";

AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://server.lyq168.cn",
});

/**
 * 获取客户列表
 * @param {*} userId
 * @param {*} pageParams
 * @param {*} queryParams
 * @returns
 */
export function getCustomerListById(userId, pageParams, queryParams) {
  // 只查看自己的客户
  const CustomerUserVO = new AV.Query("Customer");
  CustomerUserVO.equalTo("userId", userId);
  // 全局查询条件
  const globalQueryV1 = new AV.Query("Customer");
  const globalQueryV2 = new AV.Query("Customer");
  const globalQueryV3 = new AV.Query("Customer");
  const globalQueryV4 = new AV.Query("Customer");
  const globalQueryV5 = new AV.Query("Customer");
  const globalQueryV6 = new AV.Query("Customer");
  if (queryParams.global) {
    globalQueryV1.contains("custName", queryParams.global);
    globalQueryV2.contains("provinceName", queryParams.global);
    globalQueryV3.contains("cityName", queryParams.global);
    globalQueryV4.contains("areaName", queryParams.global);
    globalQueryV5.contains("remark", queryParams.global);
    globalQueryV6.contains("custPhone", queryParams.global);
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
