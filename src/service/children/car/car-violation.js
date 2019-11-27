import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import fillParams from '@/utils/fill-params.js'
import { downloadAjax } from '@/utils/common.js'

const getViolationData = (page, params = {}) => {
  params.page = {
    page: page,
    size: pageSize
  }
  return fetch(
    api.GET_VIOLATION_DATA,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}

const dealViolation = (operation, params) => {
  return fetch(
    fillParams(api.DEAL_VIOLATION, {
      operation
    }),
    params,
    'post'
  )
}

const exportViolationExcel = (params = {}) => {
  return downloadAjax(api.EXPORT_VIOLATION_EXCEL, 'post', params, '违章.xlsx', {
    defaultCity: {
      name: 'cityId'
    }
  })
}

export default {
  getViolationData,
  dealViolation,
  exportViolationExcel
}
