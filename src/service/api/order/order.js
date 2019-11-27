export default {
  /** 分时订单列表 **/
  ORDER_LIST: '/service-order-timeshare/timeshareOrder/backend/order/page',
  ORDER_INFO:
    '/service-order-timeshare/timeshareOrder/backend/order/infoDetail',
  ORDER_CURRENT_BILLING:
    '/service-order-timeshare/timeshareOrder/backend/order/currentBilling',
  ORDER_RETURN_DETAILS:
    '/service-order-timeshare/timeshareOrder/backend/order/nowOrderForBackReturnCar',
  ORDER_COUPONS: '/service-user/coupons/user/page',
  ORDER_COUPONS_INFO: '/service-user/coupons/user/isCouponsAvailable',
  ORDER_RETURN_CAR:
    '/service-order-timeshare/timeshareOrder/backend/order/returnCar',
  ORDER_RETURN_CAR_COPY:
    '/service-order-timeshare/timeshareOrder/order/returnCar',
  ORDER_LOCK: '/service-order-timeshare/timeshareOrder/backend/order/lock',
  ORDER_UNLOCK: '/service-order-timeshare/timeshareOrder/backend/order/unLock',

  /** 获取订单计费列表 **/
  GET_ORDER_CHARGE_LIST:
    '/service-order-timeshare/timeshareOrder/backend/carPrices/page',
  ADD_ORDER_CHARGE_TEMPLATE:
    '/service-order-timeshare/timeshareOrder/backend/carPrices/add',
  EDIT_ORDER_CHARGE_TEMPLATE:
    '/service-order-timeshare/timeshareOrder/backend/carPrices/update',
  GET_SUBURBAN_SERVICES_DETAIL:
    '/service-order-timeshare/timeshareOrder/backend/carPrices/detail',

  /** 分时订单评价列表 **/

  GET_ORDER_EVALUATE_LIST:
    '/service-order-timeshare/timeshareOrder/backend/comment/page',

  /** 还车异常列表 **/
  ABNORMAL_RETURN_CAR_LIST:
    '/service-order-timeshare/timeshareOrder/backend/order/exception/page',
  /** 还车异常列表 list**/
  ABNORMAL_RETURN_CAR_ORDER_LIST:
    '/service-order-timeshare/timeshareOrder/backend/order/page',
  /** 还车异常详情 list**/
  ABNORMAL_RETURN_CAR_ORDER_DETAIL:
    '/service-order-timeshare/timeshareOrder/backend/order/exception/detail',
  /** 分时套餐列表查询 **/
  TIME_SAHRE_PLAN_LIST:
    '/service-order-timeshare/timeshareOrder/backend/package/findAllByCondition',
  // 分时套餐添加套餐
  ADD_TIME_SHARE: '/service-order-timeshare/timeshareOrder/backend/package/add',
  // 分时套餐编辑
  EDIT_TIME_SHARE:
    '/service-order-timeshare/timeshareOrder/backend/package/update',
  // 套餐名称校验
  PLAN_NAME_CHECK:
    '/service-order-timeshare/timeshareOrder/backend/package/checkPackageName',
  PLAN_NAME_CHECK_EDIT:
    '/service-order-timeshare/timeshareOrder/backend/package/updateCheckPackageName',
  // 套餐是否开始
  PLAN_START_END:
    '/service-order-timeshare/timeshareOrder/backend/package/editCheckPackageIsStart'
}
