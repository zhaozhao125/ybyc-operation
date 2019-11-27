import { serviceCar } from '@/config/base-url'
export default {
  // 录入保单
  ADD_INSURANCE: `${serviceCar}insurance/slip/input-slip`,
  // 保单分页查询
  INSURANCE_LIST: `${serviceCar}insurance/slip/get-slip-page`,
  // 删除保单
  DELETE_INSURANCE: `${serviceCar}insurance/slip`,
  // 设置不续保
  NO_INSURANCE: `${serviceCar}insurance/slip/renew-slip`,
  // 获取保单详情
  GET_INSURANCE_INFOR: `${serviceCar}insurance/slip`,
  // 编辑保单
  EDIT_INSURANCE: `${serviceCar}insurance/slip/modify-slip`,
  // 导出保单
  EXPORT_INSURANCE: 'optimus/cars/insurance/slip/export-slip'
}
