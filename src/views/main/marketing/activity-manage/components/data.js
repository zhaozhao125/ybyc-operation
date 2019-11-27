
// 搜索
export const searchSettings = [
  {
    type: 'text',
    label: '活动名称',
    name: 'activityTitle',
    placeholder: '请输入',
    visible: true
  },
  {
    label: '领券方式',
    name: 'rewardWay',
    type: 'select', // 下拉列表类型
    placeholder: '请选择',
    options: [{
      label: 'H5领券',
      value: 'h5'
    }, {
      label: '兑换码领券',
      value: 'redeemCode'
    }, {
      label: '系统发券',
      value: 'system'
    }],
    visible: true
  }
  // {
  //   label: '添加时间',
  //   visible: true,
  //   name: 'addTime',
  //   type: 'daterange'
  //   // unixTime: true
  //   // 直接转成时间戳
  //   // unixTime: true
  // },
  // {
  //   label:'城市',
  //   type:'city',
  //   name:'cityId',
  //   enableAuth:true,
  //   visible:true
  // }
]
// 详情页
