import {fetch} from '@/utils/fetch'
import api from '@/service/api/'
import {pageSize} from '@/config/page-config.js'
import {download} from '@/utils/common'
import { downloadAjax } from '@/utils/common.js'
//优惠券管理
const getCouponsList = (params) => {
  return fetch(api.GET_COUPONS_LIST, params, 'post', {},{requestBodyType:'formData',defaultCity:{
    name:'cityId'
    }})
};
const addCoupons = (params) => {
  return fetch(api.ADD_COUPONS, params, 'post', {})
};
const editCoupons = (params) => {
  return fetch(api.EDIT_COUPONS, params, 'post', {})
};
const getCouponsInfo = (params) => {
  return fetch(api.GET_COUPONS_INFO, params, 'post', {},{requestBodyType:'formData'})
};
const getCouponsDrawList = (params) => {
  return fetch(api.GET_COUPONS_DRAW_LIST, params, 'post', {},{requestBodyType:'formData'})
};
// 导出随机码
const exportCouponsCode = params => {
  return downloadAjax(api.EXPORT_COUPONS_CODE + '?couponsId='+params, 'post', {}, '优惠券.xlsx')
}

// 删除
const delCoupons = params => {
  return fetch(api.DELETE_COUPONS + '?id='+params,{}, 'post', {})
}

export default {
  getCouponsList,
  addCoupons,
  editCoupons,
  getCouponsInfo,
  exportCouponsCode,
  getCouponsDrawList,
  delCoupons
}
