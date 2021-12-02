import { message } from "antd";
import AV from "leancloud-storage";
import {
  nickHeader,
  nickFoot,
  femaleNameItems,
  maleNameItems,
  surnameItems,
} from "./dictionary";

AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://server.lyq168.cn",
});

/**
 * 随机数
 * @param {*} minNum
 * @param {*} maxNum
 * @returns
 */
export const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

/**
 * 私有属性#报错 先增加_以示区分
 */
class RandomName {
  static readme = "";

  _getNickHeader() {
    return nickHeader[randomNum(0, nickHeader.length)];
  }
  _getNickFoot() {
    return nickFoot[randomNum(0, nickFoot.length)];
  }
  getNickName() {
    return this._getNickHeader() + this._getNickFoot();
  }
  getMaleName() {
    return (
      surnameItems[randomNum(0, surnameItems.length)] +
      maleNameItems[randomNum(0, maleNameItems.length)]
    );
  }
  getFemaleNameName() {
    return (
      surnameItems[randomNum(0, surnameItems.length)] +
      femaleNameItems[randomNum(0, femaleNameItems.length)]
    );
  }
  getRandomName() {
    return (
      surnameItems[randomNum(0, surnameItems.length)] +
      [...femaleNameItems, ...maleNameItems][
        randomNum(0, [...femaleNameItems, ...maleNameItems].length)
      ]
    );
  }
}

export let randomName = new RandomName();

/**
 * 默认传-1 获取省份
 * 获取市/区/县 code 传 parentCode
 * @param {*} code
 * @returns
 */
export const queryRegion = (code = "-1") => {
  return new Promise((resolve, reject) => {
    const REGIONVO = new AV.Query("REGION");
    REGIONVO.equalTo("parentCode", code);
    REGIONVO.find()
      .then((res) => {
        const list = res.map((item) => {
          return {
            center: item.get("center"),
            code: item.get("code"),
            level: item.get("level"),
            name: item.get("name"),
            parentCode: item.get("parentCode"),
          };
        });
        resolve(list);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "错误");
      });
  });
};
