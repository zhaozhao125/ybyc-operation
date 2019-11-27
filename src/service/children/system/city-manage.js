import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const post_operationManagePagingOrSearch = obj => {
  let name
  obj.name ? (name = obj.name) : (name = '')
  return fetch(
    `${api.CITYMANAGE_PAGE}?page=${obj.page}&rows=${obj.rows}&name=${name}`,
    null,
    'post',
    {}
  )
}
const get_operationCityDist = name => {
  // alert(name)
  return fetch(`${api.CITYMANAGE_AREALIST}?name=${name}`, null, 'get')
}
const post_operationCityAdd = obj => {
  return fetch(api.CITYMANAGE_ADD, obj, 'post')
}
const post_operationCityUpdate = obj => {
  return fetch(api.CITYMANAGE_UPDATE, obj, 'post')
}
// CITYMANAGE_INFO
//
const get_operationCityInfo = id => {
  return fetch(`${api.CITYMANAGE_INFO}?id=${id}`, null, 'get')
}
export default {
  post_operationManagePagingOrSearch, // 搜索和分页
  get_operationCityDist, // 运营城市远程搜索字典
  post_operationCityAdd, // 添加运营城市
  post_operationCityUpdate, // 修改运营城市
  get_operationCityInfo // 根据id查数据
}
