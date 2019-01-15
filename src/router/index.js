import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/page/Login.vue')
const NotFound = () => import('@/components/page/404.vue')
const Home = () => import('@/components/common/Home.vue')
const Dashboard = () => import('@/components/page/Dashboard.vue')

Vue.use(Router)

/* 初始路由 */
export default new Router({
    mode: 'history',
    routes: [
        {
        path: '/login',
        name: 'login',
        component: Login
        }
    ] 
})


/* 准备动态添加的路由 */
export const DynamicRoutes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        redirect: '/dashboard',
        meta: {
            requiresAuth: true,
            name: '首页'
        },
        children: [
            {
                path: '/dashboard',
                component: Dashboard,
                name: 'dashboard',
                meta: { title: '个人中心' }
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        component: NotFound  // 表示找不到
    },
    {
        path: '*',    // 此处需特别注意至于最底部
        redirect: '/404'
    }
]

