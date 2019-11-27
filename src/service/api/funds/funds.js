export default {
  GetPayList: '/service-user/serviceUser/payment/record/page',
  getRefundList: '/service-user/serviceUser/refunds/record/page',
  // 退款管理/运营审核
  getOptimusCheckList: '/service-user/serviceUser/userMoneyRefund/list',
  // 退款管理/财务处理
  getRefundHandleList: '/service-user/serviceUser/refunds/record/page',
  getCapitalFlowBalance: '/service-user/serviceUser/userMoney/record/page',
  getCapitalFlowSubjects:
    '/service-user/serviceUser/userMoney/getActionCodeList',
  getFundsChange: '/service-user/serviceUser/basic/list',
  adminManualDeduct: '/service-user/serviceUser/userMoney/adminManualDeduct',
  materialDamage: '/service-user/serviceUser/userMoney/materialDamage',
  carDamagePay: '/service-user/serviceUser/userMoney/carDamagePay',
  violationRulesPay: '/service-user/serviceUser/userMoney/violationRulesPay',
  adminManualRecharge:
    '/service-user/serviceUser/userMoney/adminManualRecharge',
  // 赠送余额 充值
  giftBalanceAdd:
    '/service-user/serviceUser/userMoney/adminManualRechargeUserMoneyPresentation',
  // 赠送余额 扣款
  giftBalanceReduce:
    '/service-user/serviceUser/userMoney/adminManualDeductUserMoneyPresentation',
  // 审核通过或驳回
  optimusCheckHandel: '/service-user/serviceUser/userMoneyRefund/check',
  // 财务取消
  financeCancel: '/service-user/serviceUser/userMoneyRefund/cancle',
  // 资金流水列表
  accountCapitalList: '/service-user/serviceUser/userMoneyRefund/list/record',
  // 支付宝、微信、银行卡确定退款
  confirmRefund: '/service-user/serviceUser/userMoneyRefund/record/confirm',
  // 银行卡取消退款
  cancelRefund: '/service-user/serviceUser/userMoneyRefund/record/cancel',
  // 财务处理查看财务详情
  refundHandelInfor: '/service-user/serviceUser/userMoneyRefund/list',
  downloadCapitalFlowFile: '/optimus/userMoney/record/export',
  // 运营审核导出
  exportOptimusList: '/optimus/userMoneyRefund/excelExportForCheck',
  // 财务处理导出
  exportRefund: '/optimus/userMoneyRefund/excelExportForFinancial',
  // 收款对账单
  downloadPaylist: '/optimus/payment/record/excelExport',
  downloadRefundbilllist: '/optimus/refunds/record/excelExport',
  fundsSum: '/service-user/serviceUser/userMoney/record/finance',
  /**
   * 红包
   */
  // 红包流失科目
  GET_RED_PACKET_SUBJECTS:
    '/service-user/promotion/userRedPacket/getActionCodeList',
  // 红包列表
  RED_PACKET_LIST: '/service-user/promotion/userRedPacket/record/page',
  // 统计红包资金
  GET_RED_PACKET_COUNT: '/service-user/promotion/userRedPacket/record/finance',
  // 红包导出
  EXPORT_RED_PACKET_DATA: '/optimus/promotion/userRedPacket/record/excel',
  // 分时出行卡
  TIME_SHARE_CARD: '/service-user/serviceUser/userMoney/record/page',
  // 分时出行卡科目
  TIME_SHARE_CARD_SUBJECTS:
    '/service-user/serviceUser/userMoney/getActionCodeList',

  /**
     * 发票
     */
  // 发票列表
  INVOICE_LIST: '/service-user/serviceUser/invoice/list',
  INVOICE_HANDLE_STATUS: '/service-user/serviceUser/invoice/handleStatus',
  INVOICE_DETAIL: '/service-user/serviceUser/invoice/detail',
  INVOICE_EXPORT: '/optimus/serviceUser/invoice/export',
  INVOICE_RELATION_ORDERS: '/service-user/serviceUser/invoice/invoiceRelationOrders',
  INVOICE_ORDER_INFO: '/service-user/serviceUser/invoice/order/status'
}
