import { carRentList, rentStatus } from '@/config/select-data'
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
    label: '运营城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  },
  {
    label: '租赁状态',
    name: 'rentStatusCode',
    type: 'select',
    options: rentStatus
  },
  {
    label: '动力状态',
    name: 'ready',
    type: 'select',
    options: [
      {
        label: '有动力',
        value: 1
      },
      {
        label: '无动力',
        value: '0'
      },
      {
        label: '未知',
        value: -1
      }
    ]
  },
  {
    label: '租赁类型',
    name: 'rentTypeCode',
    type: 'select',
    options: carRentList
  },
  {
    label: '车型',
    name: 'carModelCode',
    type: 'select',
    options: []
  },
  {
    label: '是否亏电',
    name: 'lowPower',
    type: 'select',
    options: [
      {
        label: '亏电',
        value: 'true'
      },
      {
        label: '充足',
        value: 'false'
      }
    ]
  },
  {
    label: '是否充电中',
    name: 'charging',
    type: 'select',
    options: [
      {
        label: '是',
        value: 'true'
      },
      {
        label: '否',
        value: 'false'
      }
    ]
  },
  {
    label: '在线状态',
    name: 'active',
    type: 'select',
    options: [
      {
        label: '在线',
        value: 'true'
      },
      {
        label: '离线',
        value: 'false'
      }
    ]
  }
]
