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
    optionValue: 'carNumber',
    options: [
      {
        value: 'carNumber',
        label: '车牌号'
      },
      {
        value: 'carVin',
        label: '车架号'
      },
      {
        value: 'policyNumber',
        label: '保单号'
      },
      {
        value: 'insurant',
        label: '被保险人'
      }
    ]
  },
  {
    label: '运营城市',
    name: 'carCityId',
    type: 'city',
    enableAuth: true,
    visible: true
  },
  {
    label: '车型',
    name: 'carModelCode',
    type: 'select',
    optionValue: '',
    default: '',
    options: []
  },
  {
    label: '车辆类别',
    name: 'carUseFor',
    placeholder: '请选择',
    type: 'select',
    options: [
      {
        value: 'rent',
        label: '租赁'
      },
      {
        value: 'sale',
        label: '销售'
      }
    ]
  },
  {
    label: '保险状态',
    name: 'slipStatus',
    type: 'select',
    placeholder: '请选择',
    optionValue: '',
    events: {
      change: 'insuranceStatusChange'
    },
    options: [
      {
        value: 'effective',
        label: '在保'
      },
      {
        value: 'expired',
        label: '脱保'
      },
      {
        value: 'renew_ignored',
        label: '不续保'
      }
    ]
  },
  {
    label: '保险公司',
    name: 'insurerName',
    type: 'select',
    placeholder: '请选择',
    optionValue: '',
    options: []
  },
  {
    label: '险种',
    name: 'riskCode',
    type: 'select',
    placeholder: '请选择',
    optionValue: '',
    options: [
      {
        label: '交强险',
        value: 'CLIVTA'
      },
      {
        label: '商业险',
        value: 'VI'
      },
      {
        label: '驾乘险',
        value: 'DRIVING'
      }
    ]
  },
  {
    label: '终保日期',
    name: 'insuranceEnd',
    type: 'daterange',
    disabled: false
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  }
]
