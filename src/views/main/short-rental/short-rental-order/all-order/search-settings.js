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
    label: '订单状态',
    name: 'orderStatus',
    placeholder: '请选择',
    type: 'select',
    visible: true,
    options: [
      {
        value: 'subscribed',
        label: '已预定'
      },
      {
        value: 'rent',
        label: '租赁中'
      },
      {
        value: 'returned',
        label: '已还车'
      },
      {
        value: 'finished',
        label: '已完成'
      },
      {
        value: 'cancel',
        label: '已取消'
      }
    ]
  },
  {
    label: '结算状态',
    name: 'settleStatus',
    type: 'select',
    placeholder: '不限',
    optionValue: '',
    options: [
      {
        value: 'settled',
        label: '已结算'
      },
      {
        value: 'unsettle',
        label: '待结算'
      }
    ]
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity'
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
      }, {
        value: 'short',
        label: '短租'
      }
    ]
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
    label: '使用优惠券',
    name: 'isUseCoupon',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        value: 'used',
        label: '使用'
      }, {
        value: 'unused',
        label: '不使用'
      }

    ]
  },
  {
    label: '添加时间',
    name: 'dateType',
    type: 'labelSelectDateRange',
    optionValue: 'createdTime',
    options: [
      {
        value: 'createdTime',
        label: '下单时间'
      },
      {
        value: 'takeTime',
        label: '取车时间'
      },
      {
        value: 'returnTime',
        label: '还车时间'
      },
      {
        value: 'settleTime',
        label: '结算时间'
      },
      {
        value: 'finishTime',
        label: '完成时间'
      }
    ]
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  },
  {
    label: '还车来源',
    name: 'returnType',
    type: 'select',
    optionValue: '',
    placeholder: '请选择',
    options: [
      {
        value: 'user',
        label: '用户还车'
      },
      {
        value: 'background',
        label: '后台还车'
      }
    ]
  },
  {
    type: 'labelSelectRemote',
    placeholder: '请输入',
    name: 'selectDateRemote',
    optionValue: 'takeStationId',
    options: [
      {
        label: '取车网点',
        value: 'takeStationId'
      },
      {
        label: '还车网点',
        value: 'returnStationId'
      }
    ]
  }
]
