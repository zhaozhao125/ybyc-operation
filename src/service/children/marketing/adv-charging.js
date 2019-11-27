import {fetch} from '@/utils/fetch'
import api from '@/service/api/'
import {pageSize} from '@/config/page-config.js'
import {download} from '@/utils/common'
//查询广告列表
const getAdvertisingList = (params) => {
  return fetch(api.GET_ADV_LIST, params, 'get', {},{
    defaultCity:{
      name: 'city_id'
    }
  })
  // return fetch('http://47.100.76.78:8470/advertisement/get-advertisement-list', params, 'get', {})
};
//添加广告
const addAdvertising = (params) => {
  return fetch(api.ADD_ADV, params, 'get', {})
};
//编辑广告
const editAdvertising = (params) => {
  return fetch(api.EDIT_ADV, params, 'get', {})
};
//删除广告
const deleteAdvertising = (params) => {
  return fetch(api.DELETE_ADV, params, 'get', {})
};
//启用禁用
const switchAddStatus = (id, is_enable) => fetch(api.ENABLED_ADV, {
  id,
  is_enable
}, 'get', {})

export default {
  getAdvertisingList,
  addAdvertising,
  editAdvertising,
  deleteAdvertising,
  switchAddStatus
}
