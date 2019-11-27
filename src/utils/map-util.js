import { handleWebsiteType, getStationIconText } from '@/utils/common'
import { fenchColor } from '@/config/map-config'

/**
 * 根据坐标获取地理位置
 * @param  {Array} position 坐标数组
 * @param  {Object} config   返回值设置
 * @return {Promise}          根据config返回位置字符串或者详细信息Object
 */
export function getAddress (position, config) {
  let geocoder = new AMap.Geocoder({
    raduis: 1000,
    extensions: 'all'
  })
  return new Promise((resolve, reject) => {
    geocoder.getAddress(position, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        if (result && result.regeocode) {
          if (config && config.fullData) {
            resolve(result.regeocode)
          } else {
            resolve(result.regeocode.formattedAddress)
          }
        } else {
          reject(result)
        }
      } else {
        reject(status, result)
      }
    })
  })
}

function getStationHTML (data) {
  return `<div class="panel-content">
            <ul>
              <li>
                <span class="panel-key">租赁类型：</span>
                <span class="panel-value">${data.rendType}</span>
              </li>
              <li>
                <span class="panel-key">网点类型：</span>
                <span class="panel-value">${handleWebsiteType(data.type)}</span>
              </li>
              <li>
                <span class="panel-key">服务电话：</span>
                <span class="panel-value">${data.phone}</span>
              </li>
            </ul>
          </div>`
}

function getInfoWindowContent (data) {
  return `<div class="infowindow-panel">
            <div class="panel-header">
              <h3>${data.name}</h3>
            </div>
            <div class="panel-content">
              <ul>
                <li ><span class="panel-key">网点类型：</span><span class="panel-value">${handleWebsiteType(data.type)}</span></li>
                <li ><span class="panel-key">租赁类型：</span><span class="panel-value">${data.rentType}</span></li>
                <li ><span class="panel-key">有无充电桩：</span><span class="panel-value">${data.chargingId ? '有' : '无'}</span></li>
                <li ><span class="panel-key">营业时间：</span><span class="panel-value">${data.openingHours}</span></li>
                <li ><span class="panel-key">服务电话：</span><span class="panel-value">${data.phone}</span></li>
                <li ><span class="panel-key">启用状态：</span><span class="panel-value">${data.open}</span></li>
                <li ><span class="panel-key">地址：</span><span class="panel-value">${data.address}</span></li>
              </ul>
            </div>
          </div>`
}

function formatStationData (data) {
  return data.map(item => {
    if (item.timeSharingStation && item.longRentStation) {
      item.rentType = '分时，短租'
      // item.icon = './static/img/fenshiAndChangzu.png'
    } else if (item.timeSharingStation) {
      item.rentType = '分时'
      // item.icon = './static/img/fenshi.png'
    } else {
      item.rentType = '短租'
      // item.icon = './static/img/changzu.png'
    }
    item.open = item.open ? '启用' : '禁用'
    return item
  })
}

/**
 * 渲染网点
 * @param  {Object} map      地图实例对象
 * @param  {Array} stations 网点数据（包含围栏数据）
 * @param  {Object} config   设置：
 *                           {
                                renderStationScope: Boolean, 是否渲染全部网点围栏
                                showStationScopeOnClick: Boolean, 是否点击网点时渲染该网点围栏
                                context: Object, 事件上下文指向
                                onClickInfoWindow: Function, 点击网点回调函数
                              }
 * @return {Promise}          resolve markerList实例
 */
export function renderStation (map, stations, config = {}) {
  console.log(config)
  console.log(map)
  console.log(stations)
  return new Promise((resolve, reject) => {
    AMapUI.loadUI(
      [
        'control/BasicControl',
        'misc/MarkerList',
        'overlay/SimpleMarker',
        'overlay/SimpleInfoWindow'
      ],
      function (BasicControl, MarkerList, SimpleMarker, SimpleInfoWindow) {
        if (
          !BasicControl ||
          !MarkerList ||
          !SimpleMarker ||
          !SimpleInfoWindow
        ) {
          return reject(new Error('组件加载失败'))
        }
        // 缩放控件
        map.addControl(
          new BasicControl.Zoom({
            position: 'rb',
            showZoomNum: true // 显示zoom值
          })
        )

        // 点击显示网点的保存数组
        let _clickStationScopeList = []
        let _stationScopeGroup

        // 加载网点marker
        let markerList = new MarkerList({
          map: map,
          autoSetFitView: true,
          // 从数据中读取位置, 返回lngLat
          getPosition: function (item) {
            return [item.longitude, item.latitude]
          },
          // 数据ID，如果不提供，默认使用数组索引，即index
          getDataId: function (item, index) {
            return item.id
          },
          getInfoWindow: function (data, context, recycledInfoWindow) {
            // 点击marker弹出infowindow的回调
            if (config.context && config.onClickInfoWindow) {
              config.onClickInfoWindow.apply(context, [data])
            }
            // 点击网点marker时显示改网点的围栏
            if (config.showStationScopeOnClick) {
              if (!data.hasStationScope) {
                _clickStationScopeList.push(
                  new AMap.Polygon({
                    map: map,
                    path: data.returnCarPolygon,
                    ...fenchColor
                  })
                )
                data.hasStationScope = true
              }
            }
            if (AMap && AMap.InfoWindow) {
              if (recycledInfoWindow) {
                recycledInfoWindow.setContent(getInfoWindowContent(data))

                return recycledInfoWindow
              }

              return new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -30),
                // closeWhenClickMap:true,//鼠标点击地图之后关闭信息窗体
                content: getInfoWindowContent(data)
              })
            } else {
              if (recycledInfoWindow) {
                recycledInfoWindow.setInfoTitle(data.name)
                recycledInfoWindow.setInfoBody(getStationHTML(data))

                return recycledInfoWindow
              }

              return new SimpleInfoWindow({
                infoTitle: data.name,
                infoBody: getStationHTML(data),
                offset: new AMap.Pixel(0, -40),
                events: {
                  close () {
                    console.log('====close====')
                  }
                }
              })
            }
          },
          // 构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
          getMarker: function (data, context, recycledMarker) {
            if (recycledMarker) {
              console.log('====recycledMarker====', recycledMarker)
              recycledMarker.setIconStyle({
                src: `./static/img/station/${data.chargingId ? 'has-charge' : 'no-charge'}.png`,
                style: {
                  width: '50px',
                  display: 'block'
                }
              })
              recycledMarker.setIconLabel({
                innerHTML: `<span>${getStationIconText(data)}</span>`, // 设置文字内容
                style: {
                  color: '#fff',
                  fontSize: '10px',
                  marginTop: data.chargingId ? '19px' : '11px',
                  marginRight: data.chargingId ? '5px' : ''
                }
              })
              return recycledMarker
            }

            return new SimpleMarker({
              iconStyle: {
                src: `./static/img/station/${data.chargingId ? 'has-charge' : 'no-charge'}.png`,
                style: {
                  width: '50px',
                  display: 'block'
                }
              },
              iconLabel: {
                innerHTML: `<span>${getStationIconText(data)}</span>`, // 设置文字内容
                style: {
                  color: '#fff',
                  fontSize: '10px',
                  marginTop: data.chargingId ? '19px' : '11px',
                  marginRight: data.chargingId ? '5px' : ''
                }
              },
              iconTheme: 'fresh',
              showPositionPoint: false,
              offset: data.chargingId ? new AMap.Pixel(-23, -60) : new AMap.Pixel(-25, -51)
            })
          }
        })
        let dataToRender = formatStationData(stations)
        // let dataToRender = stations
        // 是否绘制全部网点围栏
        if (config.renderStationScope && AMap && AMap.Polygon) {
          setTimeout(() => {
            let stationScopeList = []
            dataToRender.forEach(item => {
              stationScopeList.push(
                new AMap.Polygon({
                  map: map,
                  path: item.returnCarPolygon,
                  ...fenchColor
                })
              )
            })
            _stationScopeGroup = new AMap.OverlayGroup(stationScopeList)
            _stationScopeGroup.hide()
            AMap.event.addListener(map, 'zoomend', () => {
              if (_stationScopeGroup) {
                if (map.getZoom() >= 14) {
                  _stationScopeGroup.show()
                } else {
                  _stationScopeGroup.hide()
                }
              }
            })
          }, 500)
        }
        markerList.render(dataToRender)

        // 清空所有网点数据
        markerList.clearAllData = () => {
          markerList.clearData()
          if (_stationScopeGroup) {
            _stationScopeGroup.hide()
          }
          if (_clickStationScopeList && _clickStationScopeList.length) {
            _clickStationScopeList.forEach(item => {
              item.hide()
            })
          }
        }

        // 格式化数据并渲染
        markerList.formatAndRender = data => {
          markerList.clearAllData()
          data = formatStationData(data)
          setTimeout(() => {
            markerList.render(data)
            markerList.clearRecycle()
          }, 100)
        }
        // 设置zoom
        markerList.setZooms = data => {
          console.log(data)
          markerList.autoSetFitView = data
          console.log(map.getZoom())
          if (!data) {
            map.setZoom(14)
          } else {
          }
        }
        markerList.setCenter = data => {
          map.setCenter([data[0], data[1]])
        }
        resolve(markerList)
      }
    )
  })
}
