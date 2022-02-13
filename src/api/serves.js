// 新建文件夹http.js或者是serves.js
//基于axios进行二次封装
// import axios from "axios";
// axios
//   .get(url, {
//     params: {}
//   })
//   .then(response => {})
//   .catch(error => {});
const { default: axios } = require("axios");
import NProgress from "nprogress";

// import qs from "qs";

// axios封装
//node环境变量
switch (process.env.NODE_ENV) {
  case "production":
    axios.defaults.baseURL = `http://localhost:8080/hou/api/private/v1/`;
    break;
  // case "test":

  //   AuthenticatorAssertionResponse.default.baseURL = `http://127.0.0.1:8888/api/private/v1/`;
  //   break;
  default:
    axios.defaults.baseURL = `http://localhost:8080/hou/api/private/v1/`;
}
// 设置超时时间和跨域时候运行携带凭证
axios.defaults.timeout = 10000;
axios.defaults.withXCredentials = true;

// x-xxx-form-urlencoded 设置请求传递的数据格式
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
// axios.defaults.transformRequest = (data) => qs.stringify(data);
// 拦截器
// TOKEN校验(JWT):接收服务器返回的token,储存到vuex本地存储中,每次向服务器发送请求,把token携带上
axios.interceptors.request.use(
  (config) => {
    NProgress.start()
    // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
    let token = window.sessionStorage.getItem("token");
    token && (config.headers.Authorization = token);
    return config; //不返回所有请求都不返回
  },
  (error) => {
    NProgress.start()
    return Promise.reject(error);
  }
);
// 响应拦截器:服务器返回的信息
/* axios.defaults.validateStatus = status=>{
  // 自定义响应状态码
  return /^(2|3)\d{2}$/.test(status);
} */
axios.interceptors.response.use(
  (response) => {
    NProgress.done()

    // 有结果但是返回的是错误的可以进行配置
    // switch (response.data.meta.status) {
    //   case 400: //当前请求用户需要验证(未登录,没权限)
    //     alert("400");
    //     break;
    //   case 401: //当前请求用户需要验证(未登录,没权限)
    //     alert("未授权");
        
    //     break;
    //   case 403: //已经理解请求,但是拒绝(token过期)
    //     alert("被禁止访问");

    //     break;
    //   case 404: //找不到页面
    //     alert("请求的资源不存在");

    //     break;
    //   case 422: //找不到页面
    //     alert("[POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误");

    //     break;
    //   case 500: //内部错误
    //     alert("内部错误");

    //     break;
    // }
    return response.data;
  },
  (error) => {
    NProgress.done()
    let { response } = error;
    if (response) {
      // 服务器已返回了结果
      switch (response.meta.status) {
        case 401: //当前请求用户需要验证(未登录,没权限)
          alert("未授权");
          
          break;
        case 403: //已经理解请求,但是拒绝(token过期)
          alert("被禁止访问");

          break;
        case 404: //找不到页面
          alert("请求的资源不存在");

          break;
        case 422: //找不到页面
          alert("[POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误");

          break;
        case 500: //内部错误
          alert("内部错误");

          break;
      }
    } else {
      // else服务器都没有结果,没网或者服务器崩溃
      if (!window.navigator.onLine) {
        // 断网处理:可以跳转到断网页面
        alert("断网啦!");
        return;
      }
      return Promise.reject(error, "服务器错误");
    }
  }
);

export default axios;
