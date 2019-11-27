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
    label: '状态处理',
    name: 'handleStatusCode',
    type: 'select',
    options: [
      {
        label: '待处理',
        value: 'unack'
      },
      {
        label: '已处理',
        value: 'confirmed'
      },
      {
        label: '已忽略',
        value: 'ignored'
      }
    ]
  },
  {
    label: '告警类别',
    name: 'typeCode',
    type: 'slot'
  },
  {
    label: '告警事件',
    name: 'eventCode',
    type: 'slot'
  },
  // 状态字典
  // {
  //   label: '告警类别',
  //   name: 'typeCode',
  //   type: 'select',
  //   options: []
  // },
  // {
  //   label: '告警事件',
  //   name: 'eventCode',
  //   type: 'select',
  //   options: []
  // },

  {
    label: '告警时间',
    name: 'time',
    type: 'daterange'
  }
]
