export const statueMapDotColor = {
  // 注释   behavior: '#ff6447' 异常操作
  behavior: '#ff765c', // 异常操作
  tbox: '#51CD00', // tbox异常
  soc: '#fdd000', // 亏电
  idle: '#5badfc', // 车辆闲置
  location: '#4e4e4e', // 位置异常
  status: 'red', // 状态异常
  multipleTypes: '#3e8aae', // 多种类型
  VACANT: '#96c840', // 空闲
  OCCUPIED: '#fdd000', // 已预约
  CHECK_IN: '#5badff', // 已租
  ON_MAINTENANCE: '#4e4e4e' // 维护中
}
const statueMapDotstrokeColor = {
  behavior: '#f1d2cd', // 异常操作
  tbox: '#C6EFB0', // tbox异常
  soc: '#faea9f', // 亏电
  idle: '#c3e0fc', // 车辆闲置
  multipleTypes: '#bcd4e0',
  location: '#DFE0E0', // 位置异常
  status: '#f1d8d8', // 状态异常
  VACANT: '#e1fbb5', // 空闲
  OCCUPIED: '#faea9f', // 已预约
  CHECK_IN: '#c4dff9', // 已租
  ON_MAINTENANCE: '#DFE0E0' // 维护中
}

const groupStyleMap = dotName => {
  return {
    pointStyle: {
      width: 15,
      height: 15,
      offset: ['-50%', '-50%'],
      fillStyle: statueMapDotColor[dotName],
      lineWidth: 3,
      strokeStyle: statueMapDotstrokeColor[dotName]
    }
  }
}

export const renderMassPoint = (map, data, isAutoSetFitView = false) => {
  return new Promise((resolve, reject) => {
    AMapUI.loadUI(
      [
        'control/BasicControl',
        'misc/PointSimplifier',
        'overlay/SimpleInfoWindow'
      ],
      (BasicControl, PointSimplifier, SimpleInfoWindow) => {
        if (!(BasicControl, PointSimplifier || SimpleInfoWindow)) {
          reject('海量点组件加载失败')
        }
        // 缩放控件
        map.addControl(
          new BasicControl.Zoom({
            position: 'rb',
            showZoomNum: true
          })
        )
        let pointSimplifierIns = new PointSimplifier({
          map: map,
          zIndex: 999,
          // compareDataItem: (a, b, aIndex, bIndex) => {
          //   // 数据源中靠后的元素优先，index大的排到前面去
          //   return aIndex > bIndex ? -1 : 1
          // },
          getPosition: dataItem => {
            if (!dataItem) {
              return null
            }
            // 返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
            return dataItem.lngLatArr
          },
          getHoverTitle: data => {
            return ''
          },
          autoSetFitView: isAutoSetFitView,
          // 使用GroupStyleRender
          renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            getGroupId: item => {
              return item.typeCode
            },
            groupStyleOptions: typeCode => {
              return groupStyleMap(typeCode)
            },
            // autoSetFitView: true,
            pointHoverStyle: {
              width: 16,
              height: 16
            },
            // 是否聚合
            pointHardcoreStyle: {
              width: 0,
              height: 0
            }
          }
        })
        // pointSimplifierIns.setZIndex({ zindex: 9999 })
        pointSimplifierIns.setData(data)
        resolve({
          pointSimplifierIns,
          map
        })
      }
    )
  })
}
export const refreshTime = 300000
