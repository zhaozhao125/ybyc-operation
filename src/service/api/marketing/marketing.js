import advertisingManager from './advertising-manager.js' // 广告管理
import couponsManager from './coupons-manager.js' // 优惠券管理
import rechargeCardManager from './rechage-card.js' // 充值卡管理
import promoterManager from './promoter-manager' // 优推广员管理
import activityManage from './activity-manage' // 活动管理

export default {
  ...advertisingManager,
  ...couponsManager,
  ...rechargeCardManager,
  ...promoterManager,
  ...activityManage
}
