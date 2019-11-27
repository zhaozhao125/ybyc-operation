import { serviceCar } from '@/config/base-url'
export default {
  // 添加保险公司
  ADD_INSURANCE_COMPANY: `${serviceCar}insurance/insurer`,
  // 保险公司查询
  INSURANCE_COMPANY_SEARCH: `${serviceCar}insurance/insurer/get-insurer-page`,
  // 保险公司修改
  EDIT_COMPANY: `${serviceCar}insurance/insurer/modify-insurer`,
  // 删除公司
  DELETE_COMPANY: `${serviceCar}insurance/insurer`,
  // 录入保单
  ADD_INSURANCE: `${serviceCar}insurance/slip/input-slip`
}
