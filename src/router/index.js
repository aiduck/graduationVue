import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children:[
        {
            path: '/dashboard',
            component: resolve => require(['../components/page/Dashboard.vue'], resolve),
            meta: { title: '个人中心' }
        },
        {
          // 学院专业班级
          path: '/basicInfo',
          component: resolve => require(['../components/page/BaseInfo.vue'], resolve),
          meta: { title: '基础信息' }
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
  ]
})
