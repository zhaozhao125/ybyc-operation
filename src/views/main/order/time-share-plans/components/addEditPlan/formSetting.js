export default [
  {
    label: '基本信息',
    items: [
      {
        label: '套餐名称',
        name: 'packageName',
        type: 'text',
        required: true,
        // maxlength: 6,
        // placeholder: '请输入套餐名称，最长不超过6个字'
        placeholder: '请输入套餐名称'
      },
      {
        label: '描述',
        name: 'packageDecription',
        type: 'text',
        placeholder: '展示在APP套餐名称后，最长不超过12个字',
        required: true,
        maxlength: 12
      },
      {
        label: '活动介绍页面',
        name: 'activityDescUrl',
        type: 'text',
        required: true,
        type: 'slot'
      },
      {
        label: '套餐图标',
        name: 'packageIconUrl',
        type: 'img',
        limit: 1,
        tip: '建议图片大小：高度32px（宽度不定）',
        required: true
      }
    ]
  },
  {
    label: '套餐信息',
    items: [
      {
        label: '运营城市',
        name: 'cityId',
        type: 'city',
        enableAllCity: false,
        required: true
      },
      {
        label: '车型',
        name: 'carTypes',
        required: true,
        type: 'slot'
      },
      // {
      //   label: '套餐时段',
      //   name: 'planQuantum',
      //   required: true,
      //   type: 'timerange'
      // },
      {
        label: '套餐时段',
        name: 'timeText',
        required: true,
        type: 'slot'
      },
      {
        label: '套餐金额',
        name: 'amount',
        required: true,
        type: 'slot'
      },
      {
        label: '套餐起止日期',
        name: 'planDuring',
        required: true,
        type: 'datetimerange'
      },
      {
        label: '是否启用',
        name: 'isOpen',
        type: 'radio',
        options: [
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ],
        value: 1,
        required: true
      },
      {
        label: '顺序',
        name: 'sorting',
        type: 'slot'
      }
    ]
  }
]
