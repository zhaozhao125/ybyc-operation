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
    optionValue: 'userPhone',
    options: [
      {
        value: 'userPhone',
        label: '用户手机号'
      },
      {
        value: 'carNumber',
        label: '车牌号'
      },
      {
        value: 'userName',
        label: '用户名'
      },
      {
        value: 'orderSn',
        label: '订单编号'
      }
    ]
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  },
  {
    label: '订单类型',
    name: 'orderType',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        value: 'longRent',
        label: '长租'
      },
      {
        value: 'short',
        label: '短租'
      }
    ]
  },
  {
    label: '租期还车时间',
    name: 'returnTime',
    type: 'daterange',
    getTime: '111'
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  }
]
