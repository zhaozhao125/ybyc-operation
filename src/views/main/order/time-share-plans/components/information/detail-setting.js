export const planDetailSettings = [
  {
    label: '基本信息',
    items: [
      {
        name: '套餐名称',
        fieldName: 'packageName'
      },
      {
        name: '描述',
        fieldName: 'packageDecription'
      },
      {
        name: '活动介绍',
        fieldName: 'activityDescUrl',
        type: 'slot'
      },
      {
        name: '套餐图片',
        fieldName: 'packageIconUrl',
        type: 'img'
      }
    ]
  },
  {
    label: '套餐信息',
    items: [
      {
        name: '运营城市',
        fieldName: 'cityName'
      },
      {
        name: '车型',
        fieldName: 'carGenreName'
      },
      {
        name: '套餐时段',
        fieldName: 'planTime'
      },
      {
        name: '套餐金额',
        fieldName: 'amount'
      },
      {
        name: '套餐起止日期',
        fieldName: 'planDate'
      },
      {
        name: '是否启用',
        fieldName: 'isOpen'
      }
    ]
  },
  {
    label: '其他信息',
    items: [
      {
        name: '创建人',
        fieldName: 'createdBy'
      },
      {
        name: '创建时间',
        fieldName: 'createdTime'
      },
      {
        name: '最后修改人',
        fieldName: 'modifiedBy'
      },
      {
        name: '最后修改时间',
        fieldName: 'modifiedTime'
      }
    ]
  }
]
