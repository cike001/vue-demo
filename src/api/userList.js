import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/loginout',
    method: 'post'
  })
}

// 获取用户全部菜单（验证权限）加用户信息
export function getUserMenus() {
  return request({
    url: '/getUserMenus',
    method: 'post'
  })
}
// 图片上传
export function uploadimg(data) {
  return request({
    url: '/base64upload',
    method: 'post',
    data
  })
}
// 获取用户列表
export function getusers(data) {
  return request({
    url: '/getusers',
    method: 'post',
    data
  })
}
// 更新用户信息
export function userupdate(data) {
  return request({
    url: '/userupdate',
    method: 'post',
    data
  })
}
// 新增用户
export function useradd(data) {
  return request({
    url: '/useradd',
    method: 'post',
    data
  })
}
// 删除用户
export function userdelete(data) {
  return request({
    url: '/userdelete',
    method: 'post',
    data
  })
}
// 角色列表
export function getrolelist(data) {
  return request({
    url: '/getrolelist',
    method: 'post',
    data
  })
}
// 角色新增
export function roleadd(data) {
  return request({
    url: '/roleadd',
    method: 'post',
    data
  })
}
// 角色更新
export function roleupdate(data) {
  return request({
    url: '/roleupdate',
    method: 'post',
    data
  })
}
// 角色删除
export function roledelete(data) {
  return request({
    url: '/roledelete',
    method: 'post',
    data
  })
}

// 获取全部菜单列表（不验证权限）
export function getmenuall(data) {
  return request({
    url: '/getmenuall',
    method: 'post',
    data
  })
}

// 修改权限（菜单）
export function ruleupdate(data) {
  return request({
    url: '/ruleupdate',
    method: 'post',
    data
  })
}

// 新增权限（菜单）
export function ruleadd(data) {
  return request({
    url: '/ruleadd',
    method: 'post',
    data
  })
}

// 删除权限（菜单）
export function ruledelete(data) {
  return request({
    url: '/ruledelete',
    method: 'post',
    data
  })
}
