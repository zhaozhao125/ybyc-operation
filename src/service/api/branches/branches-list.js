import { serviceCarStation } from '@/config/base-url'
export default {
    BRANCHLIST_PAGE: `${serviceCarStation}station/page`,
    BRANCHLIST_DELETE: `${serviceCarStation}station/delete`,
    BRANCHLIST_UPDATESTATUS: `${serviceCarStation}station/updateStatus`,
    BRANCHLIST_DISTRICTLIST: `${serviceCarStation}station/district/list`, // 选择片区
    BRANCHLIST_WEBSITEDETAIL: `${serviceCarStation}station/info`,
    BRANCHLIST_STATIONADD: `${serviceCarStation}station/add`,
    BRANCHLIST_STATIONUPDATE: `${serviceCarStation}station/update`,
    BRANCHLIST_OPERATIONCITYLIST: `service-common/common/operationCity/list`, // 下拉查询城市
    CHARGING_STATIONLIST: '/service-charging/charging/stations/all'
}