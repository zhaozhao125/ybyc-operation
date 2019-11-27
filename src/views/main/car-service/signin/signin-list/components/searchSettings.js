import dayjs from 'dayjs'
export default [
  {
    label: '签到日期',
    name: 'signDate',
    type: 'date',
    value: dayjs().format('YYYY-MM-DD'),
    valueFormat: 'yyyy-MM-dd',
    visible: true
  },
  {
    label: '城市',
    name: 'areaId',
    type: 'remoteCity',
    // enableAuth: true,
    events: {
      change: 'changeCity'
    },
    visible: true
  },
  // {
  //   label: '片区',
  //   name: 'districtId',
  //   type: 'slot'
  // },
  {
    label: '搜索',
    name: 'selectText',
    type: 'labelSelectText',
    placeholder: '请输入',
    optionValue: 'mobile',
    options: [
      {
        label: '手机号码',
        value: 'mobile'
      },
      {
        label: '姓名',
        value: 'name'
      }
    ]
  },
  {
    label: '是否签到',
    name: 'hasSign',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        label: '签到',
        value: 1
      },
      {
        label: '未签到',
        value: 0
      }
    ]
  }
]
