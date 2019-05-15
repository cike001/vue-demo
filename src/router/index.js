import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true }
  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
// export const asyncRouterMap = {
//   Home: r => require.ensure([], () => r(require('@/views/Home')), 'Home'),
//   UserManage: r => require.ensure([], () => r(require('@/views/Users')), 'UserManage'),
//   AuthManage: r => require.ensure([], () => r(require('@/views/AuthManage')), 'AuthManage'),
//   SysManage: r => require.ensure([], () => r(require('@/views/SysManage')), 'SysManage')
// }
export const asyncRouterMap = {
  Home: () => import('@/views/Home'),
  UserManage: () => import('@/views/Users'),
  AuthManage: () => import('@/views/AuthManage'),
  SysManage: () => import('@/views/SysManage')
}
