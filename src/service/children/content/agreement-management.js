import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
// 协议内容
const getAgreementDetail = () => {
  return fetch(api.AGREEMENTCONTENT, null, 'get', {})
}

const updateUserAgreement = (params) => {
  return fetch(api.UPDATEUSERAGREEMENT, params, 'post', {},{
    requestBodyType: 'formData'
  })
}

const updateRechargeAgreement = (params) => {
  return fetch(api.UPDATERECHARGEAGREEMENT, params, 'post', {},{
    requestBodyType: 'formData'
  })
}
export default {
  getAgreementDetail,
  updateUserAgreement,
  updateRechargeAgreement
}
