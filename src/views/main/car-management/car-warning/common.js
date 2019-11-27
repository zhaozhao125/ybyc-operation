import Vue from 'vue'
import { getAddress } from '@/utils/map-util'
import { getRentStatus } from '@/utils/common'
import { handleDate } from '@/utils/date-filter'

const chargingType = ['未充电', '充电中', '充电完成', '充电故障']

const fun = (carSn, callBackData) => {
  Vue.prototype.$service.getCarWarningStatue(carSn).then(res => {
    if (res.data.code === '0') {
      callBackData(res.data.data)
    }
  })
}
export const getWarningDetailData = (carSn, getData) => {
  fun(carSn, data => {
    if (
      !isNaN(data.lng) &&
      !isNaN(data.lat) &&
      (data.lng >= 1 && data.lat >= 1)
    ) {
      getAddress([data.lng, data.lat]).then(address => {
        // console.log(address, 'aaaaa')
        data.address = address
        data.soc = handleSoc(data.soc)
        data.carNumber = data.carNumber === -1 ? '未知' : data.carNumber
        data.charging = handleCharging(data.charging)
        // data.charging === -1 ? '未知' : chargingType[data.charging]
        data.active =
          typeof data.active === 'undefined'
            ? '未知'
            : data.active ? '在线' : '离线'
        data.rentStatus =
          data.rentStatusCode === -1
            ? '未知'
            : getRentStatus[data.rentStatusCode]
        data.reportTime = data.reportTime
          ? handleDate(new Date(data.reportTime * 1000))
          : '未知'
        data.speed = handleSpeed(data.speed)
        data.acc = data.acc === -1 ? '未知' : data.acc === 0 ? 'OFF' : 'ON'
        getData(data)
      })
    } else {
      data.address = '获取地址失败'
      data.soc = handleSoc(data.soc)
      // data.soc = isNaN(data.soc) && data.soc === -1 ? '未知' : `${data.soc}%`
      data.acc = data.acc === -1 ? '未知' : data.acc === 0 ? 'OFF' : 'ON'
      data.carNumber = data.carNumber === -1 ? '未知' : data.carNumber
      data.charging = handleCharging(data.charging)
      data.active =
        typeof data.active === 'undefined'
          ? '未知'
          : data.active ? '在线' : '离线'
      data.rentStatus =
        data.rentStatusCode === -1 ? '未知' : getRentStatus[data.rentStatusCode]
      data.reportTime = data.reportTime
        ? handleDate(new Date(data.reportTime * 1000))
        : '未知'
      data.speed = handleSpeed(data.speed)
      getData(data)
    }
  })
}
function handleSpeed (speed) {
  // console.log(speed, ';;;;;;;;;;;;')
  if (!isNaN(speed) && speed !== -1) {
    return `${speed}km/h`
  } else {
    return '未知'
  }
}
function handleSoc (soc) {
  if (!isNaN(soc) && soc !== -1) {
    return `${soc}%`
  } else {
    return '未知'
  }
}
function handleCharging (charging) {
  if (!isNaN(charging) && charging !== -1) {
    return chargingType[charging]
  } else {
    return '未知'
  }
}
