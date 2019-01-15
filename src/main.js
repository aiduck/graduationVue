// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/aliCoin.css'
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import store from './store'


import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = [
  'login'
]

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

NProgress.configure({ showSpinner: false })

// 在每次路由跳转前
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.user.token) {
    /* 重新生成一次token，对token进行延时 */
    store.dispatch('Authorization').then(() => {
      console.log('token 延时');
    }).catch(error => {
      console.log(error)
    })
    /* 如果没有路由列表 */
    if (!store.state.permission.routeList) {
      /* 如果没有routeList，那么去后端获取 */
      store.dispatch('FETCH_PERMISSION').then(() => {
        next({ path: to.path });
      })
    } else {
      // 这边就是路由自动处理
      // 如果有路由就进入自动的路由内容
      // 如果没有路由，那么直接进入404
      next()
      // 获取路由列表成功，判断输入的路由是否是在我们获取的路由(这边因为我们已经写了路由规则所以不需要自己在筛选跳转的)
      // if(store.getters.routeList.find(v => v.path === '/').children) {
      //   let routeArray = store.getters.routeList.find(v => v.path === '/').children;
      //   let routersStr;
      //   routeArray.map(item => {
      //     let url = item.path
      //     if (url) {
      //         // 拼接所有有权限访问的连接
      //         routersStr += ',' + url
      //     }
      //   })
      //   if(routersStr.includes(to.path)) {
      //     next();
      //   } else {
      //     console.log('yhcj');
      //     next({ path: '/403', replace: true })
      //   }
      //} 
      // else {
      //   next({ path: '*', replace: true })
      // }
    }
  } else {
    /* no token */
    if (whiteList.indexOf(to.name) !== -1) { // 白名单内路由直接进入
      next()
    } else {
      next({ name: 'login' }) // 其他全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
