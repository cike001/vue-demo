// import Cookies from 'js-cookie'
const TokenKey = 'user-token'
// import Layout from '@/views/layout/Layout'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
  // return Cookies.remove(TokenKey)
}

// 菜单递归（不破坏数据结构）
export function buildTree(list, root = 0) {
  const obj = {}
  for (const item of list) {
    if (!obj[item.parent_id]) {
      obj[item.parent_id] = []
    }
    obj[item.parent_id].push(item)
  }
  return formatList(obj, root)
}

// 生成树状菜单
function formatList(list, root) {
  const res = []
  if (!list[root]) {
    return res
  }
  for (const item of list[root]) {
    item.children = formatList(list, item.id)
    res.push(item)
  }
  return res
}
