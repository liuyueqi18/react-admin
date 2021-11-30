import AV from "leancloud-storage";
import { message } from "antd";
AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://server.lyq168.cn",
});

/**
 * 登录
 * @param {*} username
 * @param {*} password
 * @returns
 */
export function userLogin(username, password) {
  return new Promise((resolve, reject) => {
    AV.User.logIn(username, password)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        message.warning(error.rawMessage || "登录失败");
      });
  });
}
