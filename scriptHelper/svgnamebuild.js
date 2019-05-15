const fs = require('fs')
const path = require('path')
const files = fs.readdirSync(path.join(__dirname, '../src/icons/svg/'))
const svgNames = []
for (const svg of files) {
  if (svg.endsWith('.svg')) {
    svgNames.push(svg.replace(/.svg/, ''))
  }
}
const basepath = path.join(__dirname, '../src/utils/svg-lib/')
if (fs.existsSync(basepath)) {
  fs.unlinkSync(path.join(basepath, '/index.js'))
  fs.rmdirSync(basepath)
}
fs.mkdirSync(basepath)
const val = JSON.stringify(svgNames.map((item, index) => {
  return { key: item, value: item }
}), null, 2)
const content = `export const svgs = ${val.replace(/"/g, "'")}
`
fs.writeFileSync(path.join(basepath, '/index.js'), content)
console.log('文件生成完毕')

