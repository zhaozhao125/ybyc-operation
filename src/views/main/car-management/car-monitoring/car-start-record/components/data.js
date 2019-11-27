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
        label: '点火',
        value: 'accOn'
      },
      {
        label: '熄火',
        value: 'accOff'
      }
    ]
  },
  {
    label: '发生时间',
    name: 'time',
    type: 'daterange'
  }
]
