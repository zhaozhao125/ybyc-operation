import {
  carModelList,
  tboxList,
  carRentList,
  addCarTypeList
} from '@/config/select-data'
// 搜索
export const searchSettings = [
  {
    name: 'user',
    type: 'labelSelectText',
    placeholder: '请输入',
    visible: true,
    data: [],
    optionValue: 'packageId',
    options: [
      {
        value: 'packageId',
        label: '套餐编号'
      },
      {
        value: 'packageName',
        label: '套餐名称'
      }
    ]
  },
  {
    label: '开始时间',
    name: 'duringTime',
    type: 'daterange',
    visible: true
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity'
  },
  {
    label: '车型',
    name: 'carGenreId',
    type: 'select',
    optionValue: '',
    default: '',
    options: []
  },
  {
    label: '是否启用',
    name: 'isOpen',
    type: 'select',
    placeholder: '请选择',
    optionValue: '',
    options: [
      {
        value: 1,
        label: '是'
      },
      {
        value: 0,
        label: '否'
      }
    ]
  }
]
