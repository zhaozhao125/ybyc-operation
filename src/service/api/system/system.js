import { serviceCommon } from '@/config/base-url'
import commonProblems from './common-problems.js'
import appVersion from './app-version.js'

export default {
  CITYMANAGE_PAGE: `${serviceCommon}operationCity/page`,
  CITYMANAGE_AREALIST: `${serviceCommon}area/list`, // 远程搜索城市
  CITYMANAGE_ADD: `${serviceCommon}operationCity/add`, // 添加运营城市
  CITYMANAGE_UPDATE: `${serviceCommon}operationCity/update`, // 修改运营城市
  CITYMANAGE_INFO: `${serviceCommon}operationCity/info`,
  ...commonProblems,
  ...appVersion
}
