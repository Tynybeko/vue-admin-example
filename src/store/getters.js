const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => {
    const user = localStorage.getItem('user')
    if (!user) return null
    return JSON.parse(user).avatarFile
  },
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: (state) => {
    return state.user.roles
    // const user = localStorage.getItem('user')
    // if (!user) return []
    // return [...JSON.parse(user).roles, 'admin']
  },
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  user: state => state.user.user,
  getUser: () => {
    const user = localStorage.getItem('user')
    if (!user) return null
    return JSON.parse(user)
  },
  baseURL: () => process.env.VUE_APP_BASE_API + '/s3/'
}
export default getters
