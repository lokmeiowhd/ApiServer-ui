// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import loading from 'vue-nice-loading'

// 外部配置文件
import Messagebox from './api/messagebox'
import Axios from './api/axios'
import VueRouter from 'vue-router'
import 'babel-polyfill' // 解决IE项目不能访问问题
// 外部配置文件 使用this.$globleconfig访问
Vue.prototype.$globleconfig = window.gcfg
Vue.prototype.$msg = Messagebox
// 初始化一下变量
// Vue.prototype.$globlevars.init()
// 全局Axios 请求，内部使用this.$http调用
Vue.prototype.$http = Axios

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(loading)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
