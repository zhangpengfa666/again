// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import MyPlugin from '@/assets/plugins/http.js'
import '@/assets/css/index.css'

import router from './router'
Vue.use(ElementUI)
Vue.use(MyPlugin)
Vue.config.productionTip = false

/* 全局过滤器 - 处理日期格式 */
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
