export const topSetting = [
  {
    label: '',
    items: [
      {
        label: '工单编号',
        value: 'sn',
        type: 'slot',
        name: 'sn'
      },
      {
        label: '车牌号',
        value: 'carNumber'
      },
      {
        label: '巡检结果',
        value: 'result'
      },
      {
        label: '巡检人',
        value: 'inspectorName'
      },
      {
        label: '巡检时间',
        value: 'createTime'
      },
      {
        label: '处理状态',
        value: 'status'
      }
    ]
  }
]

export const bottomSetting = [
  {
    label: '',
    items: [
      {
        label: '巡检照片',
        value: 'images',
        type: 'image'
      }
    ]
  }
]
