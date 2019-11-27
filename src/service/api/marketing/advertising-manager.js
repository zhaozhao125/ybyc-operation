import { servicePhp } from '@/config/base-url'
export default {
  /*管理员*/
  // 获广告列表
  GET_ADV_LIST: `${servicePhp}advertisement/get-advertisement-list`,
  //添加广告
  ADD_ADV: `${servicePhp}advertisement/add-advertisement`,
  //编辑广告
  EDIT_ADV: `${servicePhp}advertisement/edit-advertisement`,
  //删除广告
  DELETE_ADV: `${servicePhp}advertisement/delete-advertisement`,
  //启用禁用
  ENABLED_ADV: `${servicePhp}advertisement/enable-advertisement`

}
