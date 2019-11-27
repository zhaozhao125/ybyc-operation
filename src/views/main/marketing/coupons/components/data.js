
// 搜索
export const searchSettings = [
  {
    type: 'labelSelectText',
    placeholder: '请输入',
    name: 'selectText',
    optionValue: 'name',
    visible: true,
    options: [{
      label: '券名',
      value: 'name'
    }, {
      label: '券编码',
      value: 'code'
    }]
  },
  {
    label: '添加时间',
    visible: true,
    name: 'addTime',
    type: 'daterange'
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  },
  {
    label:'城市',
    type:'city',
    name:'cityId',
    enableAuth:true,
    visible:true
  }
]
// 详情页
