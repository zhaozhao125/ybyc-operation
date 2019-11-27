/**
 * 加载巡航轨迹
 * @param  {Object} map    高德地图实例
 * @param  {Object} AMapUI AMapUI对象
 * @return {Function}        返回函数
 */
export default function loadPath (map, AMapUI, handleOverPoint, handleOutPoint) {
  return new Promise((resolve, reject) => {
    try {
      AMapUI.loadUI(['misc/PathSimplifier', 'control/BasicControl'], function (
        PathSimplifier,
        BasicControl
      ) {
        if (!PathSimplifier) {
          console.log('====PathSimplifier加载失败====')
          return reject(new Error('轨迹巡航组件加载失败'))
        }
        // 缩放控件
        if (BasicControl) {
          map.addControl(
            new BasicControl.Zoom({
              position: 'rb',
              showZoomNum: true // 显示zoom值
            })
          )
        } else {
          console.log('====BasicControl加载失败====')
        }

        // 创建组件实例
        let pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map, // 所属的地图实例
          getPath: function (pathData, pathIndex) {
            // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            // 返回鼠标悬停时显示的信息
            if (pointIndex >= 0) {
              // 鼠标悬停在某个轨迹节点上
              return (
                pathData.name +
                '，点:' +
                pointIndex +
                '/' +
                pathData.path.length
              )
            }
            // 鼠标悬停在节点之间的连线上
            return pathData.name + '，点数量' + pathData.path.length
          },
          renderOptions: {
            // 点数少于该值时，会渲染轨迹节点
            renderAllPointsIfNumberBelow: 5000,
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: '#09AD7B',
              lineWidth: 6,
              dirArrowStyle: true
            },
            keyPointStyle: {
              radius: 5,
              // fillStyle: 'blue',
              // strokeStyle: 'rgba(0, 255, 0)',
              // lineWidth: 2
            }
          },
          clickToSelectPath: false
        })

        pathSimplifierIns.on('pointMouseover', function (e, info) {
          handleOverPoint(info.pointIndex)
        })
        pathSimplifierIns.on('pointMouseout', function (e, info) {
          handleOutPoint(info.pointIndex)
        })

        let _pathNavigator = null // 轨迹播放实例
        let currentIndex = 0 // 当前轨迹播放的节点

        /**
         * 设置轨迹数据
         * @param {String} name 轨迹名
         * @param {Array} path 轨迹数据，经纬度数组
         */
        function createPath (name, path) {
          if (_pathNavigator && _pathNavigator.destroy) {
            _pathNavigator.destroy()
            currentIndex = 0
          }
          pathSimplifierIns.setData([
            {
              name: name,
              path: path
            }
          ])
          pathSimplifierIns.show()
          // 创建一个巡航器
          _pathNavigator = pathSimplifierIns.createPathNavigator(
            0, // 关联第1条轨迹
            {
              loop: false, // 循环播放
              speed: 80,
              pathNavigatorStyle: {
                width: 40,
                height: 40,
                // 使用图片
                content: PathSimplifier.Render.Canvas.getImageContent(
                  'static/img/car.png',
                  onload,
                  onerror
                ),
                strokeStyle: null,
                fillStyle: null,
                // 经过路径的样式
                pathLinePassedStyle: {
                  lineWidth: 6,
                  strokeStyle: '#e74c3c',
                  dirArrowStyle: {
                    stepSpace: 15,
                    strokeStyle: '#fff'
                  }
                }
              }
            }
          )

          let stopCallback = function () {}
          let moveCallback = null

          _pathNavigator.on('move', (e, info) => {
            if (info.dataItem.pointIndex == path.length - 1) {
              // _pathNavigator.pause()
              stopCallback()
            }
            if (typeof moveCallback === 'function') {
              moveCallback(info)
            }
            currentIndex = info.dataItem.pointIndex
          })

          _pathNavigator.start()
          setTimeout(() => {
            _pathNavigator.pause()
          }, 10)

          return {
            getPath () {
              return _pathNavigator
            },
            // 开始播放
            start () {
              _pathNavigator.start()
            },
            // 停止播放
            stop () {
              _pathNavigator.stop()
            },
            // 暂停播放
            pause () {
              _pathNavigator.pause()
            },
            // 继续播放
            resume () {
              _pathNavigator.resume()
            },
            destroy () {
              _pathNavigator.destroy()
              pathSimplifierIns.clearPathNavigators()
              pathSimplifierIns.hide()
              currentIndex = 0
            },
            // 设置轨迹播放速度
            setSpeed (speed) {
              _pathNavigator.setSpeed(speed)
            },
            setRange (startIndex, endIndex) {
              _pathNavigator.setRange(startIndex, endIndex)
            },
            moveToPoint (index, tail) {
              _pathNavigator.moveToPoint(index, tail)
            },
            moveByDistance (distance) {
              _pathNavigator.moveByDistance(distance)
            },
            // 获取当前播放的节点
            getCurrentIndex () {
              return currentIndex
            },
            on (event, callback) {
              if (event == 'stop') {
                stopCallback = callback
              }
              if (event == 'move') {
                moveCallback = callback
              }
            }
          }
        }

        resolve({
          createPath
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
