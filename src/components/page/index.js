import vPage from './page.vue'

/* istanbul ignore next */
vPage.install = function (Vue) {
  Vue.component(vPage.name, vPage)
}

export default vPage
