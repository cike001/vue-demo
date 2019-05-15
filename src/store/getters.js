const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language, // 当前使用语言
  token: state => state.user.token,
  avatar: state => state.user.avatar, // 图像
  name: state => state.user.name,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routers: state => state.permission.routers
}
export default getters
