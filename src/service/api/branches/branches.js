import areaManagement from './area-management'
import branchesList from './branches-list'
import branchesMap from './branches-map'
import branchesVehicle from './branches-vehicle'
export default {
    // 之前配置的代理
    // WEB_SITE: 'http://localhost:8090/webSite/station',
    ...areaManagement,
    ...branchesList,
    ...branchesMap,
    ...branchesVehicle
}