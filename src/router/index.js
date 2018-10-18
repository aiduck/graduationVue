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
        {
          // 用户信息
          path: '/userInfo',
          component: resolve => require(['../components/page/UserInfo.vue'], resolve),
          meta: { title: '用户基础信息' },
        },
        {
          // 用户信息详情页
          path: '/userDetails/:userId/:isCheck',
          component: resolve => require(['../components/page/UserInfoDetail.vue'], resolve),
          meta: { title: '用户详情页' }
        },
        {
          // 教师信息
          path: '/teacherInfo',
          component: resolve => require(['../components/page/TeacherInfo.vue'], resolve),
          meta: { title: '教师基本信息' }
        },
        {
          // 教师信息
          path: '/teacherInfo/:userId/:isCheck',
          component: resolve => require(['../components/page/TeacherInfoDetail.vue'], resolve),
          meta: { title: '教师详情页' }
        },
        {
          // 学生信息
          path: '/studentInfo',
          component: resolve => require(['../components/page/StudentInfo.vue'], resolve),
          meta: { title: '学生基本信息' }
        },
        
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
  ]
})
