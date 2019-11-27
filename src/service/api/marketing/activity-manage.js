import { servicePhp } from '@/config/base-url'
export default {
  /*管理员*/
  // 获取活动列表
  GET_ACTIVITY_LIST: `${servicePhp}activity/activity/list`,
  // 获取活动列表
  GET_ACTIVITY_COUPONS_LIST: `${servicePhp}activity/activity/get-coupons-list`,
  //添加活动
  ADD_ACTIVITY: `${servicePhp}activity/activity/add-activity`,
  //编辑活动
  EDIT_ADV: `${servicePhp}advertisement/edit-advertisement`,
  //删除活动
  DELETE_ACTIVITY: `${servicePhp}activity/activity/delete-activity`,
  //启用禁用
  FORBIDDEN_ACTIVITY: `${servicePhp}activity/activity/set-status`,
  //导出活动随机码
  EXPORT_ACTIVITY_CODE: `/optimus/activity/randomCode/export`

}
