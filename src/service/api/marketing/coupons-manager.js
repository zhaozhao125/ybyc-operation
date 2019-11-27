import { serviceUser } from '@/config/base-url'
export default {
  /*优惠券*/
  GET_COUPONS_LIST: `${serviceUser}coupons/list`,
  ADD_COUPONS: `${serviceUser}coupons/add`,
  EDIT_COUPONS: `${serviceUser}coupons/change`,
  GET_COUPONS_INFO: `${serviceUser}coupons/detail`,
  GET_COUPONS_DRAW_LIST: `${serviceUser}coupons/user/page`,
  EXPORT_COUPONS_CODE: `/optimus/coupons/redeemCodes/upload`,
  DELETE_COUPONS: `${serviceUser}coupons/delete`,
}
