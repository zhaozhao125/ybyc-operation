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
    label: '操作类型',
    name: 'typeCode',
    type: 'select',
    visible: true,
    options: [
      {
        label: '离线',
        value: 'activeLost'
      },
      {
        label: '上线',
        value: 'activeRegain'
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
    label: '发生时间',
    name: 'time',
    type: 'daterange'
  }
]
