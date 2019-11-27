import dayjs from 'dayjs'
export default [{
  label: '签到日期',
  name: 'signDate',
  type: 'date',
  value: dayjs().format('YYYY-MM-DD'),
  valueFormat: 'yyyy-MM-dd',
  visible: true
}, {
  label: '城市',
  name: 'operationCityId',
  type: 'city',
  enableAuth: true,
  enableAllCity: false,
  events: {
    change: 'changeCity'
  },
  visible: true
}, {
  label: '片区',
  name: 'districtId',
  type: 'slot'
}]
