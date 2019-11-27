import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'
let get_carModelPagingOrSearch = function (
  page,
  pageSize,
  startDate,
  endDate,
  keyWords
) {
  return fetch(
    api.CARS_MODELS,
    {
      page,
      pageSize,
      startDate,
      endDate,
      keyWords
    },
    'get',
    {}
  )
}

let get_carModelDetail = function (id) {
  return fetch(fillParams(api.CARS_MODELSID, { id }), {}, 'get')
}
let delete_carModel = function (id) {
  return fetch(fillParams(api.CARS_MODELSID, { id }), {}, 'delete')
}
let post_carModelAdd = function (obj) {
  return fetch(api.CARS_MODELS, obj, 'post')
}
let put_carModelModigy = function (obj) {
  return fetch(api.CARS_MODELS, obj, 'put')
}
export default {
  get_carModelPagingOrSearch, // 车型列表分页 搜索
  get_carModelDetail, // 车型详情
  delete_carModel, // 删除
  post_carModelAdd, // 添加
  put_carModelModigy // 修改
}
