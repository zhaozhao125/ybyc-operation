import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'

import base from './children/base.js'
import user from './children/user.js'

Vue.use(Router)

const router = new Router({
  routes: [
    ...base,
    ...user
  ]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (store.state.user) { // 通过vuex state获取当前的user是否存在
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
