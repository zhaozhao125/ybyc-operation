import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

// 价格模板列表
const priceRuleList = params => {
  return fetch(
    api.PRICE_RULE_LIST,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      },
      requestBodyType: 'formData'
    }
  )
}
// 价格模板详情
const priceRuleInfo = (params = {}) => {
  return fetch(
    api.PRICE_RULE_INFO,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// 保存价格模板
const priceRuleSave = (params = {}) => {
  return fetch(api.PRICE_RULE_SAVE, params, 'post', {})
}

export default {
  priceRuleList,
  priceRuleInfo,
  priceRuleSave
}
