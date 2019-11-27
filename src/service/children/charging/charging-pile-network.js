import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { download } from '@/utils/common'
import { handleDate } from '@/utils/date-filter'
import axios from 'axios'
import baseUrl from '@/config/base-url'
import { Message, Loading } from 'element-ui'

let loadingStyle = {
  text: '加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.7)',
  target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
}

const getChargeOrderDetialRow = params => {
  console.dir('getChargeOrderDetialRow')
  return fetch(api.getChargeOrderDetialRow, params, 'get', {})
}
// 充电订单详情格式化
const formateChargingOrderRow = row => {
  console.dir('formateChargingOrderRow')
  let startTime = new Date()
  if (row.startTime > 0) {
    startTime.setTime(row.startTime)
    row.startTimeTxt = handleDate(startTime)
  } else {
    row.startTimeTxt = ''
  }

  let endTime = new Date()
  if (row.endTime > 0) {
    endTime.setTime(row.endTime)
    row.endTimeTxt = handleDate(endTime)
  } else {
    row.endTimeTxt = ''
  }

  let payDate = new Date()
  if (row.payDate > 0) {
    payDate.setTime(row.payDate)
    row.payDateTxt = handleDate(payDate)
  } else {
    row.payDateTxt = ''
  }
  let parkingTime = 0
  // 充电时间
  if (row.endTime - row.startTime > 0 && row.parkingMoney > 0) {
    parkingTime = ((row.endTime - row.startTime) / (3600 * 1000)).toFixed(2)
    row.parkingTime = Math.ceil(parkingTime)
  } else {
    row.parkingTime = 0
  }

  if (!row.couponName) {
    row.discountAmount = ''
    row.couponsShow = false
  } else {
    if (row.discountAmount) {
      row.discountAmount = '-' + row.discountAmount + '元'
      row.couponsShow = true
    } else {
      row.discountAmount = ''
      row.couponsShow = false
    }
  }
  return row
}

const getchargingOffline = params => {
  console.dir('getchargingOffline')
  return fetch(api.getchargingOffline, params, 'get', {})
}
const formateChargingPileStationName = rows => {
  let output = []
  for (let idx in rows) {
    output.push({
      label: rows[idx].stationName,
      value: rows[idx].id
    })
  }
  return output
}
const formateChargingPileStationNameWithname = rows => {
  let output = []
  for (let idx in rows) {
    output.push({
      label: rows[idx].stationName,
      value: rows[idx].stationName
    })
  }
  return output
}

const getChargingPileNetworkStatus = params => {
  console.dir('getChargingPileNetworkStatus')
  return fetch(api.getChargingPileNetworkStatus, params, 'post', {})
}

const getCharingOrderPrice = params => {
  console.dir('getCharingOrderPrice')
  return fetch(api.getCharingOrderPrice, params, 'get', {})
}

const formateOnlineChargingOrderprice = row => {
  if (row.online) {
    row.connectorId =
      row.connectorId + '<span style="color: green;">在线</span>'
  } else {
    row.connectorId = row.connectorId + '<span style="color: red;">离线</span>'
  }
  if (row.prices.length > 0) {
    let tmp = []

    for (let idx in row.prices) {
      tmp[idx] =
        '电费' +
        row.prices[idx].elecPrice +
        '元/度, 服务费' +
        row.prices[idx].servicePrice +
        '元/度' +
        ' ,站位费' +
        row.parkingPrice +
        '元/小时'
    }

    row.prices = tmp.join('<br />')
  } else {
    row.prices = ''
  }

  let endTime = new Date()
  let timeUsed = 0
  if (Number.parseInt(row.endTime) > 0) {
    timeUsed = Math.ceil(((row.endTime - row.startTime) / 3600000).toFixed(2))
    endTime.setTime(row.endTime)
    row.endTime = handleDate(endTime)
  } else {
    row.endTime = ''
    timeUsed = Math.ceil(
      ((new Date().getTime() - row.startTime) / 3600000).toFixed(2)
    )
  }

  row.totalMoney = '<span style="color:red;">' + row.totalMoney + '元</span>'

  if (row.parkingPrice > 0) {
    row.parkingMoney = row.parkingMoney + '元（' + timeUsed + '小时）'
  } else {
    row.parkingMoney = row.parkingMoney + '元'
  }

  return row
}
const formateCharingOrderPrice = row => {
  console.dir(formateCharingOrderPrice)
  if (row.online) {
    row.connectorId =
      row.connectorId + '<span style="color: green;">在线</span>'
  } else {
    row.connectorId = row.connectorId + '<span style="color: red;">离线</span>'
  }

  if (row.prices.length > 0) {
    let tmp = []
    for (let idx in row.prices) {
      tmp[idx] =
        '电费' +
        row.prices[idx].elecPrice +
        '元/度, 服务费' +
        row.prices[idx].servicePrice +
        '元/度' +
        ' ,站位费' +
        row.parkingPrice +
        '元/小时'
    }

    row.prices = tmp.join('<br />')
  } else {
    row.prices = ''
  }
  let timeUsed = 0
  if (row.startTime) {
    if (row.endTime) {
      timeUsed = Math.ceil(((row.endTime - row.startTime) / 3600000).toFixed(2))
    } else {
      timeUsed = Math.ceil(
        ((new Date().getTime() - row.startTime) / 3600000).toFixed(2)
      )
    }
  }

  let endTime = new Date()
  if (Number.parseInt(row.endTime) > 0) {
    endTime.setTime(row.endTime)
    row.endTime = handleDate(endTime)
  } else {
    row.endTime = ''
  }

  row.totalMoney = '<span style="color:red;">' + row.totalMoney + '元</span>'

  if (row.parkingPrice > 0) {
    row.parkingMoney = row.parkingMoney + '元（' + timeUsed + '小时）'
  } else {
    row.parkingMoney = row.parkingMoney + '元'
  }
  // row.parkingMoney = row.parkingMoney + '元（1小时）';
  return row
}

const getChargePileNetworkList = params => {
  console.dir('getChargePileNetworkList')
  return fetch(api.getChargePileNetworkList, params, 'post', {})
}

/**
 * 充电站列表
 */
const formateChargePileNetworkList = rows => {
  for (let idx in rows) {
    let timeData = new Date()
    if (rows[idx].createdOn) {
      timeData.setTime(rows[idx].createdOn)
      rows[idx].createdOn = handleDate(timeData)
    } else {
      rows[idx].createdOn = ''
    }

    // 一电特来电禁止编辑
    if (rows[idx].operatorCode === 'YD' || rows[idx].operatorCode === 'TLD') {
      rows[idx].showFun = false
    } else {
      rows[idx].showFun = true
    }
  }

  return rows
}

const getAllChargePileNetworks = params => {
  console.dir('getAllChargePileNetworks')
  return fetch(
    api.getAllChargePileNetworks,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData',
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}

const submitChangeChargPileNetworkStatus = params => {
  console.dir('submitChangeChargPileNetworkStatus')
  return fetch(api.submitChangeChargPileNetworkStatus, params, 'post', {})
}
const getChargingPileNetworkDetial = params => {
  console.dir('getChargingPileNetworkDetial')
  return fetch(api.getChargingPileNetworkDetial, params, 'get', {})
}
const getChargingPileNetworkDetial2Edit = params => {
  console.dir('getChargingPileNetworkDetial2Edit')
  return fetch(api.getChargingPileNetworkDetial2Edit, params, 'get', {})
}

const getChargingOrderList = params => {
  console.dir('getChargingOrderList')
  return fetch(
    api.getChargingOrderList,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}

const formateChargingOrderList = items => {
  let output = []
  let tmp = {}
  let statue = ''

  // 订单来源
  let userTypeCfg = {
    RETURN_CAR: '用户还车充电',
    OPS: '车服充电',
    USER: '用户自主充电'
  }

  for (let idx in items) {
    tmp = items[idx]

    tmp.status_txt = tmp.orderStatus

    switch (tmp.orderStatusCode) {
      case 'COMPLETED':
        tmp.status_class = 'state-rent'
        break
      case 'CHARGING':
        tmp.status_class = 'state-leisure'
        break
      case 'CHARGE_END':
        tmp.status_class = 'state-rent'
        break
    }

    let startTime = new Date()
    startTime.setTime(tmp.startTime)
    tmp.startTimeTxt = handleDate(startTime)

    let endTime = new Date()
    if (tmp.endTime > 0) {
      endTime.setTime(tmp.endTime)
      tmp.endTimeTxt = handleDate(endTime)
    } else {
      tmp.endTimeTxt = ''
    }

    tmp.userType = userTypeCfg[tmp.userType]

    if (
      tmp.orderStatusCode != 'CHARGE_END' &&
      tmp.orderStatusCode != 'COMPLETED' &&
      (tmp.totalMoney == 0 || tmp.totalMoney == null || !tmp.totalMoney)
    ) {
      tmp.totalMoney = ''
    }

    if (
      tmp.orderStatusCode != 'CHARGE_END' &&
      tmp.orderStatusCode != 'COMPLETED' &&
      (tmp.needPay == 0 || tmp.needPay == null || !tmp.needPay)
    ) {
      tmp.needPay = ''
    }
    if (
      tmp.orderStatusCode != 'CHARGE_END' &&
      tmp.orderStatusCode != 'COMPLETED' &&
      (tmp.actualPay == 0 || tmp.actualPay == null || !tmp.actualPay)
    ) {
      tmp.actualPay = ''
    }

    // 优惠金额显示
    if (
      tmp.orderStatusCode != 'CHARGE_END' &&
      tmp.orderStatusCode != 'COMPLETED' &&
      (tmp.discountAmount == 0 ||
        tmp.discountAmount == null ||
        !tmp.discountAmount)
    ) {
      tmp.discountAmount = ''
    }

    if (
      tmp.orderStatusCode != 'CHARGE_END' &&
      tmp.orderStatusCode != 'COMPLETED' &&
      tmp.discountAmount
    ) {
      tmp.discountAmount = '-' + tmp.discountAmount
    }

    output.push(tmp)
  }
  return output
}

const addChargingPileNetwork = params => {
  console.dir('addChargingPileNetwork  新增充电站')
  let url = ''

  if (params.url == 'add') {
    url = api.addChargingPileNetwork
  } else {
    url = api.editChargingPileNetwork
  }

  return fetch(url, params, 'post', {})
}

const formateChargePileNetworkDetial = row => {
  console.dir('formateChargePileNetworkDetial')
  // 经纬度设置
  row.lat_lng = row.lat + ' , ' + row.lng
  row.businessTime = row.openTime

  if (row.prices.length > 0) {
    row.prices_txt = []

    for (let idx in row.prices) {
      row.prices_txt[idx] =
        row.prices[idx].startTime +
        '-' +
        row.prices[idx].endTime +
        ' , ' +
        '电费' +
        row.prices[idx].elecPrice.toFixed(2) +
        '元/度 , ' +
        '服务费' +
        row.prices[idx].servicePrice.toFixed(2) +
        '元/度'

      // 价格设置
      row.prices[idx].elecPrice = row.prices[idx].elecPrice.toFixed(2)
      row.prices[idx].servicePrice = row.prices[idx].servicePrice.toFixed(2)
    }
    row.prices_txt = row.prices_txt.join('<br/>')
  } else {
    row.prices_txt = ''
  }

  if (row.parkingPrice && row.parkingPrice != null) {
    row.parkingPrice_txt = row.parkingPrice + '元/小时'
  } else {
    row.parkingPrice_txt = '0元/小时'
  }
  // 前X小时免收
  if (row.beforeHoursFree) {
    row.parkingPrice_txt += ' ,前' + row.beforeHoursFree + '小时免费'
  }

  // 封顶价添加
  let parkingPrice_txt = ''
  if (row.maxParkingPrice && row.maxParkingPrice != null) {
    parkingPrice_txt = ', 封顶' + row.maxParkingPrice + '元'
  } else {
    row.maxParkingPrice = 0
    parkingPrice_txt = ''
  }

  row.parkingPrice_txt += parkingPrice_txt

  row.charge_pile_num = '快充' + row.fastPileNum + ' ,  慢充' + row.slowPileNum

  row.latlngarr = []
  row.latlngarr.push([parseFloat(row.lng), parseFloat(row.lat)])
  row.location = [parseFloat(row.lng), parseFloat(row.lat)]
  // row.location = [121.5273285, 31.21315058];
  row.enabled_txt = row.enabled ? '是' : '否'

  let newDate = new Date()
  if (row.createdOn) {
    newDate.setTime(row.createdOn)
    row.createdOn_txt = handleDate(newDate)
  } else {
    row.createdOn_txt = ''
  }

  if (row.stationType == 'OPEN') {
    row.stationTypeName = '开放站点'
  } else if (row.stationType == 'SPECIAL') {
    row.stationTypeName = '专用站点'
  } else {
    row.stationTypeName = ''
  }

  let timeData = new Date()
  if (row.modifiedOn) {
    timeData.setTime(row.modifiedOn)
    row.modifiedOn = handleDate(timeData)
  } else {
    row.modifiedOn = ''
  }

  // 电费成本
  if (row.electricityActualCost) {
    row.electricityActualCost_edit = row.electricityActualCost
    row.electricityActualCost += '元/度'
  } else {
    row.electricityActualCost = ''
    row.electricityActualCost_edit = ''
  }

  return row
}

const postCloseChargeOrder = params => {
  console.dir('postCloseChargeOrder')
  return fetch(
    api.postCloseChargeOrder,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

function postAjax (params, accessToken, fileName) {
  let loading = Loading.service({ ...loadingStyle })

  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: params.url,
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      accessToken: accessToken
    }
  })
    .then(res => {
      Message.success('导出数据成功')
      download(fileName, res.data)
      loading.close()
    })
    .catch(error => {
      Message.warning(error.msg ? error.msg : '导出失败')
      loading.close()
    })
}

/**
 * 充电订单导出
 */
const exportChargingorder = (params, accessToken, fileName, dis) => {
  params.url = api.exportChargingorder
  postAjax(params, accessToken, fileName, dis)
}
/**
 * 充电上月费用导出
 */
const exportChargingorderMonth = (params, accessToken, fileName, dis) => {
  params.url = api.exportChargingorderMonth
  postAjax(params, accessToken, fileName)
}
/**
 * 充电上月费用导出
 */
const exportChargingPilenetwork = (params, accessToken, fileName, dis) => {
  params.url = api.exportChargingPilenetwork
  postAjax(params, accessToken, fileName)
}

export default {
  getChargePileNetworkList,
  formateChargePileNetworkList,
  submitChangeChargPileNetworkStatus,
  getChargingPileNetworkDetial,
  formateChargePileNetworkDetial,
  addChargingPileNetwork,
  getChargingPileNetworkDetial2Edit,
  getChargingOrderList,
  formateChargingOrderList,
  getCharingOrderPrice,
  getchargingOffline,
  getChargingPileNetworkStatus,
  formateChargingPileStationName,
  getAllChargePileNetworks,
  getChargeOrderDetialRow,
  formateChargingOrderRow,
  postCloseChargeOrder,
  formateCharingOrderPrice,
  formateOnlineChargingOrderprice,
  exportChargingorder,
  exportChargingorderMonth,
  exportChargingPilenetwork,
  formateChargingPileStationNameWithname
}
