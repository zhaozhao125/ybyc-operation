import {
    fetch
} from '@/utils/fetch'
import api from '@/service/api/'
let get_startRecordPagingOrSearch = (obj) => {
    return fetch(api.CAR_STARTRECORD, obj, 'get', {})
}


export default {
    get_startRecordPagingOrSearch
}