import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import Login from '@/views/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      meta: {
        title: '手机审批'
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        title: '手机审批登录'
      }
    }
  ]
})
