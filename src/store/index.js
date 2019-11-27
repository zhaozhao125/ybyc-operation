import Vue from 'vue'
import Vuex from 'vuex'
import formatAuth, { buttonAuth, buttonAuthSet } from './children/format-auth.js'
import navStore from './children/nav-store.js'

Vue.use(Vuex)

let getSessionUser = function () {
  let ret = null
  try {
    ret = JSON.parse(sessionStorage.getItem('loginData')).adminUser
  } catch (e) {}
  return ret
}
export default new Vuex.Store({
  state: {
    navClosed: false, // 左侧导航菜单是否关闭状态
    user: getSessionUser(), // 当前登录用户信息
    token: null, // 当前登录用户token
    auth: null, // 当前登录用户拥有的操作权限
    allCities: [], // 所有的运营城市
    authedCities: [], // 当前登录用户拥有权限的城市
    firstCityId: null, // 当前登录用户拥有权限的第一个城市的ID
    buttonAuth: null, // 当前登录用户拥有的按钮权限（二维列表）
    buttonAuthSet: null // 当前登录用户拥有的按钮权限（一维列表）
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    auth: state => state.auth,
    navClosed: state => state.navClosed,
    allCities: state => state.allCities,
    authedCities: state => state.authedCities,
    firstCityId: state => {
      return state.authedCities.filter(item => {
        return item.value !== 999
      })[0].value
    },
    defaultCityId: state => {
      if (state.authedCities.some(item => item.value == 999)) {
        return 999
      }
      return state.authedCities[0].value
    },
    buttonAuth: state => state.buttonAuth,
    buttonAuthSet: state => state.buttonAuthSet
  },
  mutations: {
    login (state, loginData) {
      sessionStorage.setItem('loginData', JSON.stringify(loginData))
      state.user = loginData.adminUser
      state.token = loginData.accessToken
      state.auth = loginData.adminRole.authUrls
      if (!loginData.cityModels || !loginData.cityModels.length) {
        alert('无法获取城市数据权限，请稍后再试')
        sessionStorage.removeItem('loginData')
        sessionStorage.removeItem('tabs')
        window.location.reload()
        return
      }
      state.allCities = loginData.cityModels.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      state.authedCities = loginData.cityModels
        .filter(item => item.checked)
        .map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      console.log('====authedCities====', state.authedCities)
      console.log('====buttonAuth====', buttonAuth)
      console.log('====buttonAuthSet====', buttonAuthSet)
      state.navStore.navs = formatAuth(state.auth)
      state.buttonAuth = buttonAuth
      state.buttonAuthSet = buttonAuthSet
    },
    logout (state, user) {
      sessionStorage.removeItem('loginData')
      sessionStorage.removeItem('tabs')
      state.user = null
      state.token = null
      state.auth = null
      location.reload()
    },
    setUser: function (state, user) {
      state.user = user
    },
    toggleNav: function (state) {
      state.navClosed = !state.navClosed
    }
  },
  modules: {
    navStore
  }
})
