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
    optionValue: 'parkingSn',
    options: [
      {
        value: 'parkingSn',
        label: '车位编号'
      },
      {
        value: 'parkingShowSn',
        label: '显示编号'
      },
      {
        value: 'lockEquipmentId',
        label: '设备ID'
      },
      {
        value: 'stationSn',
        label: '网点编号'
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
    label: '车位状态',
    name: 'parkingStatus',
    type: 'select',
    optionValue: '',
    default: '',
    options: [
      {
        label: '无车',
        value: '0'
      },
      {
        label: '有车',
        value: '1'
      },
      {
        label: '未知',
        value: '2'
      },
      {
        label: '故障',
        value: '3'
      }
    ]
  },
  {
    label: '车位类型',
    name: 'parkingType',
    type: 'select',
    optionValue: '',
    default: '',
    options: [
      {
        label: '分时租赁',
        value: 0
      }
    ]
  },
  {
    label: '地锁状态',
    name: 'lockStatus',
    type: 'select',
    optionValue: '',
    default: '',
    options: [
      {
        label: '已降下',
        value: '0'
      },
      {
        label: '已升起',
        value: '1'
      },
      {
        label: '故障',
        value: '2'
      },
      {
        label: '已锁车',
        value: '3'
      },
      {
        label: '已休眠',
        value: '4'
      },
      {
        label: '未知',
        value: '5'
      },
      {
        label: '离网',
        value: '6'
      }
    ]
  },
  {
    label: '添加时间',
    name: 'duringTime',
    type: 'daterange'
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  },
  {
    label: '网点名称',
    name: 'stationId',
    type: 'slot',
    placeholder: '请输入网点名称'
  },
  {
    label: '所有人',
    name: 'owner',
    type: 'select',
    optionValue: '',
    default: '',
    options: [
      {
        label: '一步用车',
        value: 'YB'
      }
    ]
  }
]
