// import { fetch } from '@/utils/fetch'
// import api from '@/service/api/'

import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import fillParams from '@/utils/fill-params.js'
// import capitalFlow from './capital-flow.js'
// import fundsBill from './funds-bill.js'
import { Message, Loading } from 'element-ui'
import {
  download,
  downloadAjax
} from '@/utils/common'
import axios from 'axios'
import baseUrl from '@/config/base-url'

let loadingStyle = {
  text: '加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.7)',
  target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
}
// 格式化显示时间
const getRowByValue = (value = '', rows = []) => {
  for (let idx in rows) {
    if (value == rows[idx]['value']) {
      return rows[idx]
    }
  }
  return ''
}

// 格式化显示时间
const getAllNetworkStationByKey = (key = '', rows = []) => {
  for (let idx in rows) {
    if (key == rows[idx]['value']) {
      return rows[idx]['label']
    }
  }
  return ''
}

// 格式化显示时间
const formateShortRentRow = (row = {}) => {
  if (row) {
    let orderType = '短租'
    if (row.orderType == 'longRent') {
      orderType = '长租'
    }
    row.snDetail = row.sn + '(' + orderType + ')'
    row.orderTypeCn = orderType
  }

  return row
}

const bindCar = (params = {}) => {
  return fetch(
    api.bindCar,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

const getAllCarsFromStationid = (params = {}) => {
  return fetch(
    api.getAllCarsFromStationid,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// optimus_3.0.3（新增）_排车第一步
const rentCarStepOne = (params = {}) => {
  return fetch(
    api.rentCarStepOne,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData',
      noErrorMsg: true
    }
  )
}

// 获取全部的网点
const getAllNetworkStation = (params = {}) => {
  return fetch(
    api.getAllNetworkStation,
    params,
    'post',
    {},
    {
      requestBodyType: false
    }
  )
}
const formateAllNetworkStation = (rows = []) => {
  console.info('formateAllNetworkStation')
  let output = []
  for (let idx in rows) {
    output.push({
      label: rows[idx]['name'],
      value: rows[idx]['id']
    })
  }

  return output
}
// 全部订单列表
const getAllCancelReason = (params = {}) => {
  return fetch(
    api.getAllCancelReason,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

// 获取车辆类型
const carList = params => {
  return fetch(api.CAR_LIST, params, 'get', {})
}
// 全部订单列表
const allOrderList = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.ALL_ORDER_LIST,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}

// 格式化全部订单列表
const formateAllOrderList = rows => {
  if (rows.length > 0) {
    for (let idx in rows) {
      // 格式化优惠券金额
      if (rows[idx]['orderStatus'] == 'cancel') {
        rows[idx]['couponsMoneyShow'] = false
      } else {
        if (rows[idx]['discountMoney']) {
          rows[idx]['couponsMoneyShow'] = true
          rows[idx]['couponsMoney'] = '-' + rows[idx]['discountMoney']
        } else {
          rows[idx]['couponsMoneyShow'] = false
          rows[idx]['couponsMoney'] = 0
        }
      }

      // 订单类型更新
      rows[idx]['orderTypeCn'] =
        rows[idx]['orderType'] == 'longRent' ? '长租' : '短租'
    }
  } else {
    return []
  }

  return rows
}

// 绑卡
const bindCard = (params = {}) => {
  return fetch(
    api.BIND_CARD,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 已还车未结算订单
const waitSettlementList = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.WAIT_SETTLEMENT,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}
// 待绑车订单
const waitBindingCar = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.WAIT_BINDING_CAR,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}

// 逾期取车订单
const overdueGet = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.OVERDUE_GET,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}
// 逾期还车订单
const overdueReturn = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.OVERDUE_RETURN,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}
// 财务待处理订单
const financePending = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.FINANCE_PENDING,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}
// 订单支付记录
const paymentRecord = params => {
  return fetch(
    api.PAYMENT_RECORD,
    params,
    'post', {}, {
      requestBodyType: 'formData',
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
// 订单支付记录导出
const paymentRecordExport = (params, fileName) => {
  return downloadAjax(api.PAYMENT_RECORD_EXPORT, 'post', params, fileName, {
    requestBodyType: 'formData',
    defaultCity: {
      name: 'cityId'
    }
  })
}
// 获取订单日志
const orderLog = (params = {}, page = 1, pageSize = 5) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.ORDER_LOG,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 获取物料列表
const materialList = (params = {}) => {
  return fetch(api.MATERIAL_LIST, params, 'post', {})
}
// 领取物料
const getMaterial = (params = {}) => {
  return fetch(
    api.GET_MATERIAL,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 归还物料
const returnMaterial = (params = {}) => {
  return fetch(
    api.RETURN_MATERIAL,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 已还，未还，所有领取
const materialAllStatus = (params = {}) => {
  return fetch(
    api.ALL_GET_RETURN_MATERIAL,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 排车列表
const orderCarList = (params = {}, page = 1, pageSize = 10) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.ORDER_CAR_LIST,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 排车
const orderCar = (params = {}) => {
  return fetch(
    // api.ORDERCAR,
    api.rentCarStepSecond,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 订单结算
const orderSettle = (params = {}) => {
  return fetch(
    api.ORDER_SETTLE,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 获取订单详情
const orderInformation = (params = {}) => {
  return fetch(
    api.ORDER_INFORMATION,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 取消订单
const cancelOrder = (params = {}) => {
  return fetch(
    api.CANCEL_ORDER,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 退款检查
const refoundCheck = (params = {}) => {
  return fetch(
    api.REFUND_CHECK,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 退款

const refound = (params = {}) => {
  return fetch(
    api.REFOUND,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 修改预约时间
const resetTime = (params = {}) => {
  return fetch(
    api.RESET_TIME,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

// 还车
const returnCar = (params = {}) => {
  return fetch(
    // api.RETURN_CAR,
    api.returnCarCheck,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData',
      noErrorMsg: false
    }
  )
}

// 还车1检查
const returnCarCheck = (params = {}) => {
  return fetch(
    api.RETURN_CAR_CHECK,
    // api.returnCarCheck,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 设置闲时
const setFree = (params = {}) => {
  return fetch(
    api.SET_FREE,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 发送租车指令
const sendRentCar = (params = {}) => {
  return fetch(
    api.SEND_RENT_CAR,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 修改业务员
const updateSaleman = (params = {}) => {
  return fetch(
    api.UPDATE_SALE_MAN,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 导出
const exportShort = (params, accessToken, fileName, dis) => {
  postAjax(params, accessToken, fileName, dis)
}

// 待绑车导出
const exportWaitBind = (params, accessToken, fileName, dis) => {
  postAjax(params, accessToken, fileName, dis)
}

function postAjax (params, accessToken, fileName, dis) {
  let loading = Loading.service({ ...loadingStyle })
  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: disType(dis),
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
// 导出页面对应的地址
function disType (dis) {
  switch (dis) {
    case 'optimus':
      return api.exportOptimusList
    case 'refund':
      return api.exportRefund
    case 'shortRental':
      return api.EXPORT
    case 'waitBind':
      return api.EXPORT_WAIT_BIND
    case 'waitSettlement':
      return api.waitSettlement
  }
}
export default {
  carList,
  allOrderList,
  formateAllOrderList,
  bindCard,
  waitSettlementList,
  waitBindingCar,
  overdueGet,
  overdueReturn,
  financePending,
  paymentRecord,
  paymentRecordExport,
  orderLog,
  materialList,
  getMaterial,
  returnMaterial,
  materialAllStatus,
  orderCarList,
  orderSettle,
  orderInformation,
  cancelOrder,
  orderCar,
  refoundCheck,
  refound,
  resetTime,
  returnCar,
  exportShort,
  returnCarCheck,
  exportWaitBind,
  setFree,
  sendRentCar,
  updateSaleman,
  getAllCancelReason,
  formateShortRentRow,
  bindCar,
  getAllNetworkStation,
  formateAllNetworkStation,
  rentCarStepOne,
  getAllCarsFromStationid,
  getAllNetworkStationByKey,
  getRowByValue
}
