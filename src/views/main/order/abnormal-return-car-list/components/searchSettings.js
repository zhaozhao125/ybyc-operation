export default [
  {
    type: 'labelSelectText',
    placeholder: '请输入',
    name: 'selectText',
    optionValue: 'carNumber',
    visible: true,
    options: [
      // {
      //   label: '企业编号',
      //   value: 'companySn'
      // },
      {
        label: '车牌号',
        value: 'carNumber'
      },
      {
        label: '用户姓名',
        value: 'userName'
      },
      {
        label: '用户手机号',
        value: 'userPhone'
      },
      {
        label: '订单编号',
        value: 'orderSn'
      }
      // {
      //   label: '优惠券名称',
      //   value: 'discountDescription'
      // }
    ]
  },
  // {
  //   label: '车牌号',
  //   name: 'carNumber',
  //   type: 'autocomplete',
  //   placeholder: '请输入车牌号',
  //   visible: true,
  //   data: []
  // },
  {
    label: '订单状态',
    name: 'orderStatus',
    type: 'select',
    options: [
      {
        label: '锁单中',
        value: 'locked'
      },
      {
        label: '待支付',
        value: 'returned'
      },
      {
        label: '已完成',
        value: 'finished'
      }
    ],
    visible: true
  },
  {
    label: '异常还车类型',
    name: 'exceptionReturnType',
    type: 'select',
    options: [
      {
        label: '定位不准',
        value: 'location'
      },
      {
        label: '车辆未响应',
        value: 'car'
      }
    ]
  },
  {
    type: 'labelSelectDateRange',
    placeholder: '请选择时间',
    name: 'selectDate',
    optionValue: 'date',
    options: [
      {
        label: '下单时间',
        value: 'date'
      },
      {
        label: '取车时间',
        value: 'startDate'
      },
      {
        label: '还车时间',
        value: 'returnDate'
      },
      {
        label: '完成时间',
        value: 'payTime'
      }
    ]
  },
  {
    label: '车型',
    name: 'carModelCode',
    type: 'select',
    options: []
  },
  {
    label: '运营城市',
    name: 'cityId',
    type: 'remoteCity',
    events: {
      change: 'changeCity'
    }
  },
  {
    label: '还车来源',
    name: 'returnType',
    type: 'select',
    placeholder: '请选择',
    options: [
      {
        label: '用户还车',
        value: 'app'
      },
      {
        label: '后台还车',
        value: 'background'
      },
      {
        label: 'tbox还车',
        value: 'tbox'
      },
      {
        label: '中控屏还车',
        value: 'screen'
      },
      {
        label: '运维还车',
        value: 'maintenance'
      },
      {
        label: '微信还车',
        value: 'weixin'
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
