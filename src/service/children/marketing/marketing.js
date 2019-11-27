import advCharging from './adv-charging.js'
import coupons from './coupons.js'
import rechageCard from './rechage-card.js'
import promoter from './promoter.js'
import activityManage from './activity-manage.js'

export default {
  ...advCharging,
  ...coupons,
  ...rechageCard,
  ...promoter,
  ...activityManage
}
