// 合并对象 并删除掉空值与undefined和null
export function clearObjVal(para, data) {
  const obj = Object.assign(data, para)
  Object.keys(obj).map(item => {
    if (obj[item] === '' || obj[item] === null) {
      delete obj[item]
    }
  })
  return obj
}
