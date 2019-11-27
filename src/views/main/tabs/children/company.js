const companyReview = () => import(/* webpackChunkName: "company" */ '@/views/main/company/company-review/')
const companyList = () => import(/* webpackChunkName: "company" */ '@/views/main/company/company-list/')
const companyFundFlow = () => import(/* webpackChunkName: "company" */ '@/views/main/company/fund-flow/')
const companyOrder = () => import(/* webpackChunkName: "company" */ '@/views/main/company/company-order/')

export default {
  companyReview,
  companyList,
  companyFundFlow,
  companyOrder
}
