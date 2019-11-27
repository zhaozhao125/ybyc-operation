import {
    fetch
} from '@/utils/fetch'
import api from '@/service/api/'
// import { STATION_BASE_URL } from '@/config/base-url'
// 请求所有网点
// let post_stationSearchList = () => {
//         // 要传一个json空对象
//         return fetch(api.BRANCHMAP_SEARCHLIST, {}, 'post', {})
//     }
// 根据id查网点
let get_websiteListByIds = (id) => {
    return fetch(api.BRANCHMAP_LISTBYIDS, { id }, 'get')
}
export default {
    // post_stationSearchList,
    get_websiteListByIds
}