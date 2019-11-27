import { serviceCharging } from '@/config/base-url'

export default {
  // 充电站列表
  getChargingPileNetworkStatus: `${serviceCharging}charging/stations`,
  // 充电站列表
  getChargePileNetworkList: `${serviceCharging}charging/stations`,
  // 充电站全部站点地图
  getAllChargePileNetworks: `${serviceCharging}charging/stations/allInCity`,
  // 开启和禁止充电站
  submitChangeChargPileNetworkStatus: `${serviceCharging}charging/stations/updateStatus`,
  // 显示时查询详情
  getChargingPileNetworkDetial: `${serviceCharging}charging/stations/detail`,
  // 编辑时查询详情
  getChargingPileNetworkDetial2Edit: `${serviceCharging}charging/stations/detailForModify`,
  // 添加接口
  addChargingPileNetwork: `${serviceCharging}charging/stations/add`,
  // 编辑页面
  editChargingPileNetwork: `${serviceCharging}charging/stations/update`,
  // 充电订单接口地址 get
  getChargingOrderList: `${serviceCharging}charging/orders`,
  // 充电订单实时价格 orderSn
  getCharingOrderPrice: `${serviceCharging}charging/orders/chargingStatus`,
  // 离线日志
  getchargingOffline: `${serviceCharging}charging/equipments/logs`,
  // 充电订单详情 get : orderSn
  getChargeOrderDetialRow: `${serviceCharging}charging/orders/detail`,
  // 结束订单
  postCloseChargeOrder: `${serviceCharging}charging/orders/closeOrder`,
  exportChargingorder: '/optimus/charging/orders/export',
  exportChargingorderMonth: '/optimus/charging/orderMonthFee/export',
  exportChargingPilenetwork: '/optimus/charging/stations/export',
}
