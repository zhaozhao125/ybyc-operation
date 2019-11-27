import customerList from './customer-list'
import customerRole from './customer-role'
import driverLicenseReview from './driver-license-review'
import customerPoints from './customer-points'

export default {
  ...customerList,
  ...customerRole,
  ...driverLicenseReview,
  ...customerPoints
}
