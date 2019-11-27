import companyReview from './company-review'
import companyList from './company-list'
import companyOrder from './company-order'
import employeesList from './employees-list'
import fundFlow from './fund-flow'

export default {
  ...companyReview,
  ...companyList,
  ...companyOrder,
  ...employeesList,
  ...fundFlow
}
