import Cookies from 'js-cookie'

const TokenKey = 'User-Token'

export const getToken = () => Cookies.get(TokenKey)

// 有效时间1天
export const setToken = (token) => Cookies.set(TokenKey, token, { expires: 1 })

export const removeToken = () => Cookies.remove(TokenKey)
