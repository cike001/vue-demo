'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning', // 使用内联模式时，DevTools中的控制台将显示消息，例如在重新加载之前，错误之前或启用热模块更换时。默认为info
    historyApiFallback: true, // 使用HTML5历史记录API时，index.html可能必须提供该页面以代替任何404回复 就是页面找不到的时候代替展示的页面 通常是404。
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /^\/$/, to: '/views/landing.html' },
    //     { from: /^\/subpage/, to: '/views/subpage.html' },
    //     { from: /./, to: '/views/404.html' }
    //   ]
    // },
    hot: true, // 热更新
    compress: true,
    host: HOST || config.dev.host, // 提供外部访问
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser, // 告诉dev-server在服务器启动后打开浏览器。将其设置true为打开默认浏览器。
    // 提供在服务器内部的所有其他中间件之后执行自定义中间件的能力。
    // after: function(app, server) {
    //   // do fancy stuff
    // }
    // 允许开发服务器访问本地服务器的包JSON文件，防止跨域
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    overlay: config.dev.errorOverlay // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖。默认情况下禁用。如果只想显示编译器错误：
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath, // 告诉服务器从哪里提供内容。只有在您想要提供静态文件时才需要这样做。
    proxy: config.dev.proxyTable,// 代理
    quiet: true, // necessary for FriendlyErrorsPlugin 除了该初始启动信息将被写入到控制台。这也意味着webpack中的错误或警告不可见。
    watchOptions: { // webpack使用文件系统来获取文件更改的通知。在某些情况下，这不起作用。例如，使用网络文件系统（NFS）时。Vagrant也有很多问题。在这些情况下，使用轮询：
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-element-admin',
      templateParameters: {
        BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
      },
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
