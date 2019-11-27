// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'

import initVue from '@/utils/init/'

initVue(Vue)

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

// 页面刷新自动登录
if (sessionStorage.getItem('loginData')) {
  store.commit('login', JSON.parse(sessionStorage.getItem('loginData')))
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
