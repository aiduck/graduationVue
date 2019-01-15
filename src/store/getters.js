const getters = {
  token: state => state.user.token,
  usertype: state => state.user.usertype,
  username: state => state.user.username,
  routeList: state => state.permission.routeList,
  menuList: state => state.permission.menuList,
}

export default getters
