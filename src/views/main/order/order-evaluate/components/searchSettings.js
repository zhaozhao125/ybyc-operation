export default [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'orderSn',
  options: [
    {
      label: '订单编号',
      value: 'orderSn'
    }, {
      label: '车牌号',
      value: 'carNumber'
    }, {
      label: '用户名',
      value: 'userName'
    }, {
      label: '用户手机号',
      value: 'userPhone'
    }]
}, {
  label: '评分筛选',
  name: 'filter',
  type: 'cascader',
  options: [{
    value: 'takeStationStar',
    label: '取车网点评分',
    children: [{
      value: 1,
      label: '一星'
    }, {
      value: 2,
      label: '二星'
    }, {
      value: 3,
      label: '三星'
    }, {
      value: 4,
      label: '四星'
    }, {
      value: 5,
      label: '五星'
    }]
  }, {
    value: 'returnStationStar',
    label: '还车网点评分',
    children: [{
      value: 1,
      label: '一星'
    }, {
      value: 2,
      label: '二星'
    }, {
      value: 3,
      label: '三星'
    }, {
      value: 4,
      label: '四星'
    }, {
      value: 5,
      label: '五星'
    }]
  }, {
    value: 'carStar',
    label: '车况评分',
    children: [{
      value: 1,
      label: '一星'
    }, {
      value: 2,
      label: '二星'
    }, {
      value: 3,
      label: '三星'
    }, {
      value: 4,
      label: '四星'
    }, {
      value: 5,
      label: '五星'
    }]
  }]
}, {
  label: '评论时间',
  name: 'date',
  type: 'daterange',
  placeholder: '请选择时间',
  data: []
}, {
  label: '运营城市',
  type: 'remoteCity',
  placeholder: '请选择',
  name: 'cityId',
  visible: true
}, {
  type: 'labelSelectRemote',
  placeholder: '请输入',
  name: 'selectDateRemote',
  optionValue: 'takeStationId',
  visible: true,
  options: [{
    label: '取车网点',
    value: 'takeStationId'
  }, {
    label: '还车网点',
    value: 'returnStationId'
  }]
}]