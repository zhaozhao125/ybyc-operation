import car from './children/car/car.js'
import order from './children/order/order.js'
import system from './children/system/system.js'
import user from './children/user/user.js'
import auth from './children/auth/auth.js'
import branches from './children/branches/branches.js'
import common from './children/common/common.js'
import carService from './children/car-service/'
import marketing from './children/marketing/marketing.js'
import funds from './children/funds/index'
import customerService from './children/customer-service/customer-service.js'
import customer from './children/customer/customer.js'
import orderList from './children/short-rental/order-list.js'
import charging from './children/charging/index.js'
import content from './children/content/index.js'
import company from './children/company/'
import shortRental from './children/short-rental/index.js'
import parking from './children/parking/parkingManagement.js'
export default {
  ...car,
  ...order,
  ...system,
  ...user,
  ...auth,
  ...branches,
  ...common,
  ...carService,
  ...marketing,
  ...customerService,
  ...funds,
  ...customer,
  ...orderList,
  ...charging,
  ...shortRental,
  ...content,
  ...company,
  ...parking
}
