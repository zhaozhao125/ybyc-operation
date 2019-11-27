import user from './user/user.js'
import auth from './auth/auth.js'
import car from './car/car'
import branches from './branches/branches'
import common from './common/common.js'
import order from './order/order'
import system from './system/system'
import carService from './car-service/'
import marketing from './marketing/marketing.js'
import customerService from './customer-service/customer-service.js'
import funds from './funds/funds.js'
import userfeedback from './user/userfeedback.js'
import userfeedbackproblem from './user/userfeedbackproblem.js'
import customer from './customer/customer.js'
import orderList from './short-rental/order-list.js'
import charging from './charging/index.js'
import content from './content/index.js'
import shortRental from './short-rental/'
import company from './company/'
import parking from './parking/parkingManagement'
let api = {
  ...car,
  ...user,
  ...auth,
  ...branches,
  ...common,
  ...order,
  ...system,
  ...carService,
  ...marketing,
  ...customerService,
  ...userfeedback,
  ...funds,
  ...customer,
  ...userfeedbackproblem,
  ...orderList,
  ...charging,
  ...shortRental,
  ...content,
  ...company,
  ...parking
}

export default api
