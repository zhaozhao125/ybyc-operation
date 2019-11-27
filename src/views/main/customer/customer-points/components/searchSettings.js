export default [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'userPhone',
  visible: true,
  options: [{
    label: '手机号',
    value: 'userPhone'
  }, {
    label: '姓名',
    value: 'userName'
  }]
}, {
  visible: true,
  type: 'labelSelectCity',
  placeholder: '请选择',
  name: 'selectCity',
  optionValue: 'cityId',
  options: [{
    label: '注册城市',
    value: 'cityId'
  }, {
    label: '所属城市',
    value: 'cityIdBelongTo'
  }]
}, {
  label: '积分收支状态',
  name: 'incDecType',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '收入',
    value: 'INC'
  }, {
    label: '支出',
    value: 'DEC'
  }],
  events: {
    change: 'subjectChange'
  }
}, {
  label: '积分科目',
  name: 'actionCodes',
  type: 'select',
  multiple: true,
  placeholder: '请选择',
  options: []
}, {
  label: '积分变更时间',
  name: 'createdTime',
  type: 'daterange',
  return: {
    name: {
      dateStart: 'dateStart',
      dateEnd: 'dateEnd'
    },
    format: 'YYYY-MM-DD'
  }
}]
