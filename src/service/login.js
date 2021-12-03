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
        message.error(error.rawMessage || "登录失败");
      });
  });
}

/**
 * 注册
 * @param {*} username
 * @param {*} email
 * @param {*} password
 * @returns
 */
export function userRegister(username, email, password) {
  const user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  return new Promise((resolve, reject) => {
    user
      .signUp()
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        message.error(error.rawMessage || "注册失败");
      });
  });
}
