import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { downloadAjax } from '@/utils/common.js'

// 获取工单列表
const getWorkOrder = (page = 1, params, needLoading) =>
  fetch(
    api.GET_WORKORDER,
    {
      page,
      pageSize,
      ...params
    },
    'post',
    needLoading,
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )

// 验收工单
const verifyWorkorder = (
  sn,
  result,
  msg,
  endStationId,
  endStationName,
  maintainDistanceM
) => {
  console.log(maintainDistanceM)
  let obj = null
  if (maintainDistanceM) {
    obj = {
      sn,
      result,
      msg,
      endStationId,
      endStationName,
      maintainDistanceM
    }
  } else {
    obj = {
      sn,
      result,
      msg,
      endStationId,
      endStationName
    }
  }
  return fetch(api.VERIFY_WORKORDER, obj, 'post')
}
// const verifyWorkorder = (sn, result, msg, endStationId, endStationName) =>
//   fetch(
//     api.VERIFY_WORKORDER,
//     {
//       sn,
//       result,
//       msg,
//       endStationId,
//       endStationName
//     },
//     'post'
//   )

// 改为抢单
const putWorkorderIntoPool = sn =>
  fetch(
    api.PUT_WORKORDER_INTO_POOL,
    {
      sn
    },
    'post',
    {}
  )

// 关闭工单
const closeWorkorder = (sn, closeType = 'simple', stationId) =>
  fetch(
    api.CANCEL_WORKORDER,
    {
      sn,
      closeType,
      stationId
    },
    'post',
    {}
  )

// 指派改派
const assignWorkorder = (sn, executorUserSn) =>
  fetch(
    api.ASSIGN_EXECUTOR,
    {
      sn,
      executorUserSn
    },
    'post'
  )

// 创建工单
const createWorkorder = params => fetch(api.CREATE_WORKORDER, params, 'post')

// 获取维修单类型
const getRepairType = () => fetch(api.GET_REPAIR_TYPE, null, 'get')

// 获取补料单类型
const getMaterialType = () => fetch(api.GET_MATERIAL_TYPE, null, 'get')

// 获取工单详情
const getWorkOrderDetail = sn =>
  fetch(
    api.GET_WORKORDER_DETAIL,
    {
      sn
    },
    'post',
    {}
  )

// 获取可运维用户列表
const getAvailableOpUser = (page = 1, keyword, sn) =>
  fetch(api.GET_AVAILABLE_OPUSER, {
    page,
    pageSize,
    keyword,
    sn
  })
// 获取验收通过时的默认网点
const getWorkOrderStation = carSn =>
  fetch(api.GET_WORKORDER_STATION, {
    carSn
  })

// 导出工单
const exportWorkorder = params => {
  return downloadAjax(api.EXPORT_WORKORDER_EXCEL, 'post', params, '工单.xlsx', {
    defaultCity: {
      name: 'cityId'
    }
  })
}

const getNextWorkorder = (createTime, cityId) =>
  fetch(
    api.GET_NEXT_WORKORDER,
    {
      createTime,
      cityId
    },
    'post',
    {}
  )

// 获取巡检详情
const getInspectionInfor = url => fetch(url, null, 'get', {})

// 误判或暂不处理
const distortUndone = params => fetch(api.DISTORT_UNDONE, params, 'post')
// 验收工单获取距离

const getDistance = params => fetch(api.GET_DISTANCE, params, 'post')

export default {
  getWorkOrder,
  verifyWorkorder,
  putWorkorderIntoPool,
  closeWorkorder,
  assignWorkorder,
  createWorkorder,
  getRepairType,
  getMaterialType,
  getWorkOrderDetail,
  getAvailableOpUser,
  getWorkOrderStation,
  exportWorkorder,
  getNextWorkorder,
  getInspectionInfor,
  distortUndone,
  getDistance
}
