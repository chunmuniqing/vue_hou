import axios from 'axios'
import qs from 'qs'
import {MessageBox} from 'element-ui'
import { showLoading, hideLoading } from './loading';
import router from "../router.js";
axios.defaults.withCredentials = true; //让ajax携带cookie
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
export default function ajax(url, data = {}, type = 'GET') {
	showLoading()//显示加载中
	return new Promise(function(resolve, reject) {
		// 执行异步ajax请求
		let promise
		if (type === 'GET') {
			// ...数据处理
			// 发送get请求
			promise = axios.get(url, data)
		} else {
			// 发送post请求
			promise = axios.post(url, qs.stringify(data))
		}
		promise.then(function(response) {
			hideLoading()//关闭加载
			// 成功了调用resolve()
			resolve(response.data)
			if (response.data.status != 'success') {c
				MessageBox.alert(response.data.msg, '错误提示', {
					confirmButtonText: '确定',
					type: 'error'
				});
			}
		}).catch(function(error) {
			hideLoading()//关闭加载
			//失败了调用reject()
			reject(error)
		})
	})
}
 