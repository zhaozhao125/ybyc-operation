import { initComponent } from './init-component'
import { initMap } from './init-map'
import { initFilter } from './init-filter'
import { initService } from './init-service'
import { initDirective } from './init-directive'
import { initIcon } from './init-icon'

export default function initVue(Vue) {
  initComponent(Vue)
  initMap(Vue)
  initFilter(Vue)
  initService(Vue)
  initDirective(Vue)
  initIcon(Vue)
}
