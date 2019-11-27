import orderList from './order-list'
import orderCharge from './order-charge'
import orderEvaluate from './order-evaluate'
import abnormalReturnCar from './abnormal-return-car'
import timeSharePlan from './time-share-plan'
import abnormalReturnCarlist from './abnormal-return-car-list'
export default {
  ...orderList,
  ...orderCharge,
  ...orderEvaluate,
  ...abnormalReturnCar,
  ...timeSharePlan,
  ...abnormalReturnCarlist
}
