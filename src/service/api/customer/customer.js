import customerManage from './customer-manage.js' // 用户管理
import customerRole from './customer-role.js'
import driverLicenseReview from './driver-license-review.js'
export default {
  ...customerManage,
  ...customerRole,
  ...driverLicenseReview
}
