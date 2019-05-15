import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import i18n from './lang' // Internationalization
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'

Vue.filter('dateForm', function([val, format]) {
  if (format) {
    return moment(new Date(val)).utcOffset(480).format(format)
  }
  return moment(val).format('YYYY-MM-DD HH:mm:ss')
})

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false

export const VM = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
