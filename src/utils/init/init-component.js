// 引入ElementUI
import '~/theme/index.css' // 自定义主题
import ELEMENT from 'element-ui'

// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

// 引入自定义全局组件
import vPage from '@/components/page/'
import vSearch from '@/components/search'
import vForm from '@/components/form'
import formGenerator from '@/components/formGenerator'

// 引入本地化存储接口
import localforage from 'localforage'

export function initComponent(Vue) {
  Vue.use(ELEMENT)
  Vue.component(CollapseTransition.name, CollapseTransition)
  Vue.use(vPage)
  Vue.use(vSearch)
  Vue.use(vForm)
  Vue.component('formGenerator', formGenerator)

  Object.defineProperty(Vue.prototype, '$localforage', {
    value: localforage,
    writable: false
  })
}
