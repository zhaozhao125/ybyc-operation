export const detailSettings = [
  {
    items: [
      {
        name: '车型名称',
        fieldName: 'name'
      },
      {
        name: '车型唯一标识',
        fieldName: 'code'
      },
      {
        name: '满电续航里程(km)',
        fieldName: 'maxRemainMileage'
      },
      {
        name: '车型座位数',
        fieldName: 'seat'
      },
      {
        name: '车型图片',
        fieldName: 'img',
        type: 'img'
      },
      {
        name: '车型备注信息',
        fieldName: 'remark'
      }
    ]
  }
]
export const searchSettings = [
  {
    label: '搜索',
    name: 'keyWords',
    type: 'autocomplete',
    placeholder: '请输入车型名称',
    visible: true,
    data: []
  }
]
