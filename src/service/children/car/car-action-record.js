import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

let get_actionRecordSearchOrPage = obj => {
    return fetch(api.CAR_ACTIONRECORD, obj, 'get', {})
}

export default {
    get_actionRecordSearchOrPage
}