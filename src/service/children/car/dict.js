import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

let get_carsInfoDict = () => {

    return fetch(`${api.CARSINFO_DICT}`, null, 'get')
}
let get_carsStatusDict = () => {
    return fetch(`${api.CARSSTATUS_DICT}`, null, 'get')
}
export default {
    get_carsInfoDict, // 车辆信息字典
    get_carsStatusDict // 车辆状态字典
}