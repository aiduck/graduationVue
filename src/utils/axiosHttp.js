import axios from 'axios'

// 超时时间
axios.defaults.timeout = 50000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//添加一个请求拦截器
axios.interceptors.request.use(function(config){
  console.log('尚未发出请求');
  // console.log(config);
  return config;
},function(error){
  return Promise.reject(error);
});

//添加一个响应拦截器
axios.interceptors.response.use(function(res){
  console.log('尚未处理响应');
  // console.log(res);
  return res;
},function(error){
  return Promise.reject(error);
});

export default axios