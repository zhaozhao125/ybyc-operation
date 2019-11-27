import {fetch} from '@/utils/fetch'
import api from '@/service/api/'
import {pageSize} from '@/config/page-config.js'
import {download} from '@/utils/common'
import { downloadAjax } from '@/utils/common.js'
//查询活动列表
const getActivityList = (params) => {
  return fetch(api.GET_ACTIVITY_LIST, params, 'get', {},{
    defaultCity:{
      name: 'city_id'
    }
  })
  // return fetch('http://47.100.76.78:8470/advertisement/get-advertisement-list', params, 'get', {})
};
//查询活动对应优惠券
const getActivityCouponsList = (params) => {
  return fetch(api.GET_ACTIVITY_COUPONS_LIST, params, 'get', {},{
    defaultCity:{
      name: 'city_id'
    }
  })
  // return fetch('http://47.100.76.78:8470/advertisement/get-advertisement-list', params, 'get', {})
};
//添加活动
const addActivity = (params) => {
  return fetch(api.ADD_ACTIVITY, params, 'post', {})
};
//编辑活动
const editAdvertising = (params) => {
  return fetch(api.EDIT_ADV, params, 'get', {})
};
//删除活动
const deleteActivity = (params) => {
  return fetch(api.DELETE_ACTIVITY, params, 'get', {})
};
//启用禁用
const switchActivityStatus = (id, forbidden,modifiedBy) => fetch(api.FORBIDDEN_ACTIVITY, {
  id,
  forbidden,
  modifiedBy
}, 'get', {})

const post_allCouponsList = (idOrName, showLoading) => {
  let obj = {}
  obj.name = idOrName
  obj.page = 1
  obj.pageSize = 200
  return fetch(api.GET_COUPONS_LIST, obj, 'post', showLoading,{requestBodyType:'formData',defaultCity:{
      name:'cityId'
    }})
}
  // 导出随机码
const exportActivityCode = params => {
  return downloadAjax(api.EXPORT_ACTIVITY_CODE + '?activityCode='+params, 'post', {}, '活动随机码.xlsx')
}

export default {
  getActivityList,
  addActivity,
  editAdvertising,
  deleteActivity,
  switchActivityStatus,
  post_allCouponsList,
  exportActivityCode,
  getActivityCouponsList
}
