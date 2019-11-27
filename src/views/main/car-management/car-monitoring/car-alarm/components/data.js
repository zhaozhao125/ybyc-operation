import {
  areaList,
  carModelList,
  tboxList,
  carRentList,
  carTypeList,
  addCarTypeList
} from '@/config/select-data'
export const searchSettings = [
  {
    label: '搜索',
    name: 'keyWords',
    type: 'autocomplete',
    placeholder: '请输入车牌号',
    visible: true,
    data: []
  },
  {
    label: '告警类型',
    name: 'alarmTypeCode',
    type: 'select',
    visible: true,
    options: [
      {
        label: '亏电',
        value: 'lowPower'
      },
      {
        label: '离线',
        value: 'active'
      },
      {
        label: '驶入运营城市',
        value: 'backHome'
      },
      {
        label: '驶出运营城市',
        value: 'leaveHome'
      }
    ]
  },
  {
    label: '运营城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  },
  {
    label: '告警时间',
    name: 'time',
    type: 'daterange'
  }
]
