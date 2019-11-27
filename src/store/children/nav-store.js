import { MAX_TAB } from '@/config/nav-config'
import { Message } from 'element-ui'

let getSessionData = itemName => {
  let navs = sessionStorage.getItem(itemName)
  if (navs && navs != 'undefined') {
    return JSON.parse(navs)
  } else {
    return null
  }
}

const state = {
  navs: [], // 菜单
  tabs: getSessionData('tabs') || [], // 打开的tab
  activeTab: getSessionData('activeTab') || {}, // 当前激活的tab
  tabParams: null // tab之间通信的参数
}

const getters = {
  navs: state => {
    sessionStorage.setItem('navs', JSON.stringify(state.navs))
    return state.navs
  },
  tabs: state => {
    sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
    return state.tabs
  },
  activeTab: state => {
    sessionStorage.setItem('activeTab', JSON.stringify(state.activeTab))
    return state.activeTab
  },
  tabParams: state => state.tabParams
}

/**
 * 根据name获取导航对象中的子项，并生成面包屑导航
 * @param  {Object} nav        树形结构导航对象
 * @param  {String} name         查询的name
 * @param  {Object} breadcrumb 生成辅助参数，调用不需传值
 * @return {Object}            返回带面包屑的结果
 */
function getNavItemByName (nav, name, breadcrumb) {
  // if(!breadcrumb){
  //   breadcrumb = {
  //     name: '',
  //     children: {}
  //   }
  // }else{
  //   breadcrumb.children = Object.assign({}, breadcrumb)
  // }
  if (nav && nav.length) {
    for (var i = nav.length - 1; i >= 0; i--) {
      if (nav[i].name == name) {
        /* breadcrumb.name = nav[i].label
        // 将Object类型DE面包屑改成Array类型
        if(breadcrumb.children.name){
          let arr = []
          while(breadcrumb.name){
            arr.push(breadcrumb.name)
            breadcrumb = breadcrumb.children
          }
          arr.reverse()
          breadcrumb = arr
        }else{
          breadcrumb = [breadcrumb.name]
        }
        nav[i].breadcrumb = breadcrumb */
        return nav[i]
      } else if (nav[i].children) {
        // breadcrumb.name = nav[i].label
        let ret = getNavItemByName(nav[i].children, name)
        if (ret) {
          return ret
        }
      }
    }
    return null
  } else {
    return null
  }
}

const mutations = {
  /**
   * 添加标签
   * @param  {String/Object} tab   [标签对象或标签名]
   */
  addTab: (state, tab) => {
    let tabName
    let params
    if (typeof tab === 'string') {
      tabName = tab
    } else if (typeof tab === 'object') {
      tabName = tab.name
      params = tab.params
    }
    if (state.tabs.length >= MAX_TAB) {
      let tab = getNavItemByName(state.tabs, tabName)
      if (tab) {
        if (params) {
          tab.params = params
        }
        state.activeTab = tab
      } else {
        Message({
          type: 'warning',
          message: `最多只能打开${MAX_TAB}个标签页`,
          duration: 1500
        })
      }
      return
    }
    let newTab = getNavItemByName(state.navs, tabName)
    if (!newTab) {
      Message({
        type: 'warning',
        message: '无此权限',
        duration: 2000
      })
      return
    }
    if (params) {
      newTab.params = params
    }
    state.activeTab = newTab
    if (state.tabs.findIndex(item => item.name == tabName) < 0) {
      state.tabs.push(state.activeTab)
    }
  },
  addCustomTab: (state, tab) => {
    let oldTab = getNavItemByName(state.tabs, tab.name)
    if (oldTab) {
      state.activeTab = oldTab
    } else {
      state.tabs.push(tab)
      state.activeTab = tab
    }
  },
  removeTab: (state, tabName) => {
    let targetIndex = state.tabs.findIndex(item => item.name == tabName)
    if (targetIndex > -1) {
      state.tabs[targetIndex].params = null
      state.tabs.splice(targetIndex, 1)
    }
    if (state.tabs.length && state.activeTab.name == tabName) {
      state.activeTab = state.tabs[state.tabs.length - 1]
    }
  },
  removeOtherTabs: state => {
    state.tabs = [state.activeTab]
  },
  clickTab: (state, tabName) => {
    state.activeTab = state.tabs.find(item => item.name == tabName)
  },
  sendToTab: function (state, data) {
    state.tabParams = data
  },
  clearTabParam: (state, tabName) => {
    let targetIndex = state.tabs.findIndex(
      item => item.name == tabName || item.marker == tabName
    )
    if (targetIndex > -1) {
      state.tabs[targetIndex].params = null
    }
  }
}

export default {
  state,
  getters,
  mutations
}
