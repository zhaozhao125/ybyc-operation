import orderList from './order-list'
import priceRule from './price-rule'
import longRentPriceRule from './long-rent-price-rule'
export default {
  ...orderList,
  ...priceRule,
  ...longRentPriceRule
}
