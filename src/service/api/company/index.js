import companyReviewList from './company-review'
import companyList from './company-list'
import employeesList from './employees-list'
import companyOrder from './company-order'
import fundFlow from './fund-flow'
export default {
  ...companyReviewList,
  ...companyList,
  ...employeesList,
  ...companyOrder,
  ...fundFlow
}
