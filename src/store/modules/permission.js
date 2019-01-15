import axios from '../../utils/axiosHttp';
import dynamicRoutes from '../../router/dynamicRoutes';
import router, { DynamicRoutes }  from '../../router/index';


import { getToken } from '@/utils/cookieToken';
import util from '../../utils/utils';

const permission = {
    // 动态路由
    // 动态侧边栏信息
    state: {
        routeList: null,
        menuList: null
    },
    mutations: {
        SET_PERMISSION: (state, routeList) => {
            state.routeList = routeList;
        },
        SET_MENU: (state, menuList) => {
            state.menuList = menuList;
        },
    },
    actions: {
        // 用户权限=> 后端获取路由列表（仅仅获取数据）
        GetPermission ({ }) {
            return new Promise((resolve, reject) => {
                let params = {
                    token: getToken()
                }
                axios
                .get('/api/authlist',{params})
                .then(res => {
                    if(res.data.code === 200) {
                        resolve(res.data.data)
                    } else {
                        Message.error({
                            message: response.message
                        })
                        reject(response.message)
                    }
                })
                .catch(err => {
                    reject(err);
                })
            })
        },
        // 获取数据之后进行数据的筛选以及存储
        async FETCH_PERMISSION({ commit, dispatch }) {
            let permissionList = await dispatch('GetPermission');
            /*  根据权限筛选出我们设置好的路由并加入到path='/'的children */
            let routes = util.recursionRouter(permissionList.route, dynamicRoutes)
            let MainContainer = DynamicRoutes.find(v => v.path === '/')
            let children = MainContainer.children
            children.push(...routes)
            

            /* 生成左侧导航菜单 */
            commit('SET_MENU', permissionList.menu);

            util.setDefaultRoute([MainContainer])

            /*  初始路由 */
            let initialRoutes = router.options.routes
            /*  动态添加路由 */
            router.addRoutes(DynamicRoutes)

            /* 完整的路由表 */
            commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        },
        // 退出登录清空前端权限路由
        RemovePermission({ commit }) {
            return new Promise(resolve => {
                commit('SET_PERMISSION', null);
                resolve()
            })
        }
    }
}

export default permission