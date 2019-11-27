// 违章处理状态
export const violationStatusDictionary = [{
  value: 1,
  label: '待处理'
}, {
  value: 2,
  label: '公司处理中'
}, {
  value: 3,
  label: '用户处理中'
}, {
  value: 4,
  label: '用户提交审核'
}, {
  value: 5,
  label: '已处理'
}]

export const carStatusDictionary = [{
  value: 0,
  label: '空闲'
}, {
  value: 1,
  label: '预约'
}, {
  value: 2,
  label: '已租'
}, {
  value: 3,
  label: '运维'
}]

export const carPowerStatusDictionary = [{
  value: -1,
  label: '获取失败'
}, {
  value: 0,
  label: '未充电'
}, {
  value: 1,
  label: '充电中'
}, {
  value: 2,
  label: '充电完成'
}, {
  value: 4,
  label: '充电故障'
}]

export const lastCarStatusDict = [{
  value: 0,
  label: '故障'
}, {
  value: 1,
  label: '空闲'
}, {
  value: 2,
  label: '预约'
}, {
  value: 4,
  label: '已租'
}, {
  value: 8,
  label: '运维'
}, {
  value: 9,
  label: '亏电'
}]


export const GPRSStatusDict = [{
  value: -1,
  label: '获取失败'
},{
  value: 0,
  label: '异常'
},{
  value: 1,
  label: '正常'
}]

export const accDict = [{
  value: -1,
  label: '获取失败'
},{
  value: 0,
  label: '关闭'
},{
  value: 1,
  label: '开启'
}]