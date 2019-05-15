import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
import { VM } from '@/main.js'
// import { generaterouter } from '@/utils/auth'
import { asyncRouterMap } from '@/router'
let en_routes = {}
let zh_routes = {}
// 递归生成路由
const generaterouter = function(list, root = 0) {
  en_routes = {}
  zh_routes = {}
  const obj = {}
  for (const item of list) {
    if (!obj[item.parent_id]) {
      obj[item.parent_id] = []
    }
    obj[item.parent_id].push({
      path: item.route,
      component: asyncRouterMap[item.component_name],
      name: item.route_name,
      hidden: !item.show, // 0隐藏 1展示
      sort: item.sort,
      meta: {
        title: item.name,
        icon: item.icon,
        id: item.id
      }
    })
    en_routes[item.route_name] = item.route_name
    zh_routes[item.route_name] = item.name
  }
  return formatTree(obj, root)
}
// 生成权限树
function formatTree(list, root) {
  const res = []
  if (!list[root]) {
    return res
  }
  for (const item of list[root]) {
    const children = formatTree(list, item.meta.id)
    if (children.length > 0) {
      item.children = children.sort((a, b) => {
        return a.sort - b.sort
      })
    }
    res.push(item)
  }
  return res.sort((a, b) => {
    return a.sort - b.sort
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    CLEAR_ROUTER: (state) => { // 清除掉路由
      state.routers = constantRouterMap
    }
  },
  actions: {
    GenerateRoutes({ commit }, roles) {
      return new Promise(resolve => {
        const routers = generaterouter(roles, 0)
        const addRouterMap = []
        for (const item of routers) {
          item.meta.parent = true
          if (item.children) {
            item.path = '/'
            item.component = Layout
            item.redirect = item.children[0].path
            addRouterMap.push(item)
          } else {
            const random = Math.random()
            addRouterMap.push({
              path: '/',
              component: Layout,
              name: item.name + '-parent',
              hidden: false,
              redirect: item.path,
              children: [item],
              meta: {
                icon: item.meta.icon,
                id: random
                // title: item.meta.title // 面包屑上面不展示
              }
            })
          }
        }
        addRouterMap.push({ path: '*', redirect: '/404', hidden: true })
        // console.log(JSON.stringify(addRouterMap, null, 2))
        // debugger
        VM.$i18n.mergeLocaleMessage('zh', { // 合并中文语言包
          route: zh_routes
        })
        VM.$i18n.mergeLocaleMessage('en', { // 合并英文语言包
          route: en_routes
        })
        commit('SET_ROUTERS', addRouterMap)
        resolve()
      })
    }
  }
}

export default permission
