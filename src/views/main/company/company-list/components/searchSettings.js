export default [{
  label: '搜索',
  name: 'selectText',
  type: 'labelSelectText',
  placeholder: '请输入',
  optionValue: 'name',
  options: [{
    label: '企业名称',
    value: 'name'
  }, {
    label: '企业编号',
    value: 'sn'
  }, {
    label: '联系电话',
    value: 'phone'
  }],
  visible: true
}, {
  label: '城市',
  name: 'cityId',
  type: 'city',
  visible: true
}, {
  label: '创建时间',
  name: 'createTime',
  type: 'daterange',
  unixTime: true
}]
