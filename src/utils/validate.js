export const validateUsername = (rule, value, callback) => {
  const reg = /^1[345789]\d{9}$/
  if (!value) {
    return callback(new Error(this.$t('login.userempty')))
  } else if (!reg.test(value)) {
    return callback(new Error(this.$t('login.usererrmsg')))
  } else {
    callback()
  }
  return reg.test(value)
}
export const validatePassword = (rule, value, callback) => {
  const reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Za-z]).*$/ // 必须包含一个数字一个英文字符且至少八位
  if (value === '' || value === undefined || value === null) {
    return callback(new Error(this.$t('login.pwdempty')))
  }
  if (!reg.test(value) && value) {
    return callback(new Error(this.$t('login.pwderrmsg')))
  } else {
    callback()
  }
  return reg.test(value)
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/* 合法uri*/
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/* 小写字母*/
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * validate base64Url
 * @param base64Url
 * @returns {boolean}
 */
export function validBse64(base64Url) {
  const re = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i
  return re.test(base64Url)
}

/**
 * 验证用户名
 * @param phoneNum 手机号码
 * @returns {boolean}
 */
export const validUserName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else {
    if (/^1[345789]\d{9}$/.test(value)) {
      callback()
    }
    callback(new Error('请输入正确的用户名'))
  }
}

/**
 * 验证密码 (可选输入参数)
 * @returns {boolean}
 */
export const validpassWord = (rule, value, callback) => {
  const reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Za-z]).*$/ // 必须包含一个数字一个英文字符且至少八位
  if (!value) {
    callback()
  } else if (!reg.test(value) && value) {
    return callback(new Error('密码必须包含一个数字一个英文字符且至少八位'))
  } else {
    callback()
  }
  return reg.test(value)
}
