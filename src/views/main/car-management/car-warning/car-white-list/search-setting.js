import {
  carModelList,
  tboxList,
  carRentList,
  addCarTypeList
} from '@/config/select-data'
// 搜索
export const searchSettings = [
  {
    name: 'keyWords',
    label: '车牌号',
    type: 'text',
    placeholder: '请输入车牌号',
    visible: true
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  }
]
