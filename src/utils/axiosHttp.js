import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/cookieToken'
import { Notification, MessageBox } from 'element-ui'

// 超时时间
axios.defaults.timeout = 50000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//添加一个请求拦截器 
axios.interceptors.request.use(function(config){
  console.log('尚未发出请求');
  // 请求的时候添加头部Authorization 里面存放token
  if (store.getters.token) {
    config.headers['Authorization'] = getToken()
  }
  // console.log(config);
  return config;
},function(error){
  return Promise.reject(error);
});

//添加一个响应拦截器
axios.interceptors.response.use(function(res){
  console.log('尚未处理响应');
  const { code, mes } = res.data
  if (code !== 200) {
    if (code === 401) {
      // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //   confirmButtonText: '重新登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {

      //   store.dispatch('FedLogOut').then(() => {
      //     location.reload() // 为了重新实例化vue-router对象 避免bug
      //   })
      // })
    } else if (code === 402) {
      Notification({
        title: '异常错误',
        message: mes,
        type: 'error'
      });
    }
    return Promise.reject(new Error('error'))
  }
  return res
},function(error){
  return Promise.reject(error);
});

export default axios