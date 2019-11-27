import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import areaManagement from './area-management'
import branchesList from './branches-list'
import branchesMap from './branches-map'
import branchesVehicle from './branches-vehicle'
export default {
    ...areaManagement,
    ...branchesList,
    ...branchesMap,
    ...branchesVehicle
}