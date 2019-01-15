import { getToken, setToken, removeToken } from '@/utils/cookieToken';
import { setStore, getStore, removeStore } from '@/utils/localStore'; 
import axios from '../../utils/axiosHttp';

const user = {
    // 用户信息必须存储在浏览器本地存储器中
    // token放在了cookie中
    // type和name放在了localstore中
    // 下次刷新页面，可以获取到信息
    state: {
        token: getToken(),
        usertype: getStore('type'),
        username: getStore('name'),
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USERTYPE: (state, usertype) => {
            state.usertype = usertype;
        },
        SET_USERNAME: (state, username) => {
            state.username = username;
        },
    },
    actions: {
        // 用户登录（后端接口验证，并且返回token）
        // token储存在cookie中
        // 用户信息username 和 usertype 存储在 window.localStorage中
        Login ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios
                .get('/api/login',{params})
                .then(res => {
                    if(res.data.code === 200) {
                        const { token, username, usertype } = res.data.data;
                        commit('SET_TOKEN', token)
                        commit('SET_USERTYPE', usertype)
                        commit('SET_USERNAME', username)
                        setToken(token);
                        setStore('name',username);
                        setStore('type',usertype);
                        resolve();
                    }
                    return res;
                })
                .catch(err => {
                    reject(err);
                })
            })
        },
        // 用户退出
        FedLogOut  ({ commit }) {
            return new Promise(resolve => {
              commit('SET_TOKEN', '')
              commit('SET_USERTYPE', '')
              commit('SET_USERNAME', '')
              removeToken()
              removeStore('name');
              removeStore('type');
              resolve()
            })
        },
        // 延续token的时间
        Authorization ({ commit, state }) {
            return new Promise((resolve, reject) => {
                // 存储在window.localStore里面的信息
                let params = {
                    username: state.username,
                    usertype: state.usertype
                }
                axios
                .get('/api/authorization',{params})
                .then(res => {
                    if(res.data.code === 200) {
                        const { token } = res.data.data
                        commit('SET_TOKEN', token)
                        setToken(token)
                        resolve()
                    }
                })
                .catch(err => {
                    reject(err);
                });
            })
        },
    }
}

export default user