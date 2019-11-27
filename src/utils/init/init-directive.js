import store from '@/store/'

export function initDirective(Vue) {
  Vue.prototype.$_has = value => {
    return store.getters.buttonAuthSet.has(value)
  }

  // 判断按钮权限指令
  Vue.directive('has', {
    bind: function (el, binding, vnode) {
      if (!Vue.prototype.$_has(binding.value)) {
        if (el.parentNode && el.parentNode.removeChild) {
          Vue.prototype.$nextTick(() => {
            el.parentNode.removeChild(el)
          })
        }
      }
    }
  })
}
