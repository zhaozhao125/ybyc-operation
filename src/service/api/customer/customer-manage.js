export default {
  /** 用户管理 && 用户认证管理 **/
  // 用户列表
  CUSTOMER_LIST: '/service-user/serviceUser/basic/list',
  // 用户状态停用启用
  SWITCH_CUSTOMER_STATUS: '/service-user/serviceUser/basic/updateUserStatus',
  // 用户角色列表
  ALL_CUSTOMER_ROLE_LIST: '/service-user/serviceUser/basic/allUserRoleList',
  // 用户详情
  USER_DETAIL: '/service-user/serviceUser/basic/userDetail',
  // 用户认证详情
  AUDIT_DETAIL: '/service-user/serviceUser/certification/auditDetail',
  // 编辑用户
  CUSTOMER_UPDATE: '/service-user/serviceUser/basic/update',
  // 用户信息审核
  CHECK_AUDIT: '/service-user/serviceUser/certification/checkAudit',
  // 重置预约次数
  RESET_RESERVE_COUNT: '/service-order-timeshare/timeshareOrder/backend/order/clearCancelSubcribeTimes',

  // 发送消息
  SEND_SMS: '/service-php/user/jpush-msg/send-user-message',
  // 获取用户所有优惠券
  // USER_COUPONS_LIST: 'coupons/user-coupons-list-all',
  USER_COUPONS_LIST: '/service-user/coupons/user/page',
  // 删除优惠券
  DELETE_USER_COUPONS: '/service-user/coupons/user/deleteUserCoupons',
  // 查看用户可以分配优惠券
  // IS_ASSIGNED_COUPONS: 'coupons/assigne-coupons',
  IS_ASSIGNED_COUPONS: '/service-user/coupons/sendCouponsList',
  // 给用户分配优惠券
  // ASSIGNE_COUPONS: 'coupons/assigne-coupons'
  ASSIGNE_COUPONS: '/service-user/coupons/user/sendCoupons'

}
