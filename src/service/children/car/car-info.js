import { fetch } from '@/utils/fetch'
// import axios from 'axios'
// import baseUrl from '@/config/base-url'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'
// import { download } from '@/utils/common'
// import { Message, Loading } from 'element-ui'
import { downloadAjax } from '@/utils/common'
// let loadingStyle = {
//   text: '加载中...',
//   spinner: 'el-icon-loading',
//   background: 'rgba(255,255,255,0.7)',
//   target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
// }
let get_carInfoPagingOrSearch = obj => {
  return fetch(
    api.CARS_INFO,
    obj,
    'get',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
let post_carInfoAdd = obj => {
  return fetch(api.CARS_INFO, obj, 'post')
}
let get_carInfoDetail = (carSn, obj) => {
  return fetch(fillParams(api.CARS_INFODETAIL, { carSn }), obj, 'get', {})
}
let put_carInfoPut = (carSn, obj) => {
  return fetch(fillParams(api.CARS_INFODETAIL, { carSn }), obj, 'put')
}
let get_carInfoSticker = carSn => {
  return fetch(fillParams(api.CARS_INFOSTICKER, { carSn }), {}, 'get')
}
// 可以把把localstorage导入一下
// 例子 存储
// if(有localstorage这个值){
//       渲染的时候从本地拿数据
// }else{
//     请求数据   然后缓存到本地
// }
let post_carInforDisable = carSn => {
  return fetch(fillParams(api.CARS_INFODISABLE, { carSn }), {}, 'post', {})
}
let post_InfoEnable = (carSn, stationId) => {
  return fetch(
    fillParams(api.CARS_INFOENABLE, { carSn }),
    { stationId },
    'post'
  )
}

let get_downloadCarInfo = (params, fileName) => {
  // getAjax(params, accessToken, fileName, dis)
  return downloadAjax(api.DOWNLOAD_CARINFO, 'get', params, fileName, {
    defaultCity: {
      name: 'cityId'
    }
  })
}
let get_downloadWebsiteList = (params, fileName) => {
  // return postAjax(params, accessToken, fileName, dis)
  return downloadAjax(api.DOWNLOAD_WEBSITELIST, 'post', params, fileName, {
    defaultCity: {
      name: 'operationCityId'
    }
  })
}

let get_downloadOrderList = (params, fileName) => {
  // postAjax(params, accessToken, fileName, dis)
  return downloadAjax(api.DOWNLOAD_ORDERLIST, 'post', params, fileName, {
    defaultCity: {
      name: 'cityId'
    }
  })
}

let get_downloadOrderComment = (params, fileName) => {
  // postAjax(params, accessToken, fileName, dis)
  return downloadAjax(api.DOWNLOAD_ORDERCOMMENT, 'post', params, fileName, {
    defaultCity: {
      name: 'cityId'
    }
  })
}

let get_downloadCarStatus = (params, fileName) => {
  // return getAjax(params, accessToken, fileName, dis)
  return downloadAjax(api.DOWNLOAD_CARSTATUS, 'get', params, fileName, {
    defaultCity: {
      name: 'cityId'
    }
  })
}

// 车辆操作记录
const carRecordList = (obj = {}, page = 1, pageSize = 10) => {
  obj.page = page
  obj.pageSize = pageSize
  return fetch(
    api.CAR_RECORD_LIST,
    obj,
    'get',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
// 修改车辆状态

let carStatusSet = obj => {
  return fetch(api.CAR_STATUS_SET, obj, 'post', {})
}

// function getAjax (params, accessToken, fileName, dis) {
//   let loading = Loading.service({ ...loadingStyle })
//   axios({
//     baseURL: baseUrl || '/',
//     method: 'get',
//     url: disType(dis),
//     params: params,
//     responseType: 'blob',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       accessToken: accessToken
//     }
//   })
//     .then(res => {
//       Message.success('导出数据成功')
//       download(fileName, res.data)
//       loading.close()
//     })
//     .catch(error => {
//       Message.warning(error.msg ? error.msg : '导出失败')
//       loading.close()
//     })
// }

// function postAjax (params, accessToken, fileName, dis) {
//   let loading = Loading.service({ ...loadingStyle })
//   axios({
//     baseURL: baseUrl || '/',
//     method: 'post',
//     url: disType(dis),
//     data: params,
//     responseType: 'blob',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       accessToken: accessToken
//     }
//   })
//     .then(res => {
//       Message.success('导出数据成功')
//       download(fileName, res.data)
//       loading.close()
//     })
//     .catch(error => {
//       Message.warning(error.msg ? error.msg : '导出失败')
//       loading.close()
//     })
// }

// function disType (dis) {
//   switch (dis) {
//     case 'carInfo':
//       return api.DOWNLOAD_CARINFO
//     case 'website':
//       return api.DOWNLOAD_WEBSITELIST
//     case 'orderList':
//       return api.DOWNLOAD_ORDERLIST
//     case 'orderComment':
//       return api.DOWNLOAD_ORDERCOMMENT
//     case 'carStatus':
//       return api.DOWNLOAD_CARSTATUS
//   }
// }

export default {
  get_carInfoPagingOrSearch, // 分页查询
  post_carInfoAdd, // 添加
  get_carInfoDetail, // 详情
  put_carInfoPut, // 修改
  post_carInforDisable, // 禁用
  post_InfoEnable, // 启用
  get_carInfoSticker, // 车贴二维码
  get_downloadCarInfo, // 车辆信息导出
  get_downloadWebsiteList, // 网点列表导出
  get_downloadOrderList, // 订单列表导出
  get_downloadOrderComment, // 订单评论导出
  get_downloadCarStatus, // 车辆状态批量导出
  carRecordList, // 车辆操作记录
  carStatusSet // 车辆状态修改
}
