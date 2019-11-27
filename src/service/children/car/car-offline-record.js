import {
    fetch
} from '@/utils/fetch'
import api from '@/service/api/'

let get_offlineRecordSearchOrPage = (obj) => {
    return fetch(api.CAR_OFFLINERECORD, obj, 'get', {})
}


export default {
    get_offlineRecordSearchOrPage
}