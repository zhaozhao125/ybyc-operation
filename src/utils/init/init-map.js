// 引入高德地图
import VueAMap, {
  lazyAMapApiLoaderInstance
} from 'vue-amap'

export function initMap(Vue) {
  // 使用高德地图
  Vue.use(VueAMap)
  VueAMap.initAMapApiLoader({
    key: '160cab8ad6c50752175d76e61ef92c50',
    v: '1.4.2',
    // plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    plugin: [
      'Scale',
      'Geolocation',
      'AdvancedInfoWindow',
      'Geocoder',
      'PathSimplifier',
      'AMap.MouseTool',
      'AMap.OverlayGroup'
    ],
    uiVersion: '1.0' // 版本号
  })
  // 高德UI组件加载失败提示
  lazyAMapApiLoaderInstance.load().then(() => {
    (function fixUI() {
      if (window.AMapUI) {
        let tmpFunc = window.AMapUI.loadUI
        window.AMapUI.loadUI = function (unames, cb) {
          tmpFunc(unames, function () {
            let args = [...arguments]
            if (args.some(item => !item)) {
              console.log('====unames====', unames, args)
              alert('地图组件加载失败，请刷新浏览器后重试')
            } else {
              cb.call(window, ...args)
            }
          })
        }
      } else {
        setTimeout(() => {
          fixUI()
        }, 50)
      }
    })()
  })
}
