export default [
  {
    label: '搜索',
    name: 'selectText',
    type: 'labelSelectText',
    placeholder: '请输入',
    optionValue: 'name',
    options: [
      {
        label: '充值卡名称',
        value: 'name'
      },
      {
        label: '充值卡批次号',
        value: 'batchNum'
      }
    ],
    visible: true
  },
  {
    label: '添加时间',
    name: 'createOn',
    type: 'daterange',
    // unixTime: true,
    visible: true
  }
]
