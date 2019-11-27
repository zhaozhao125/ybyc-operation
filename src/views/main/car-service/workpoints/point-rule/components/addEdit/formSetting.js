export default [
  {
    label: '基本信息',
    items: [
      {
        label: '工分规则名称',
        name: 'name',
        type: 'text',
        required: true,
        placeholder: '请输入工分规则名称'
      },
      {
        label: '城市',
        name: 'city',
        type: 'remoteCity',
        isShowAll: false,
        required: true,
        placeholder: '请选择',
        integratedValue: true

        // disabled: true,
      }
      // {
      //   label: '站位费',
      //   name: 'parkingPrice',
      //   type: 'number',
      //   placeholder: '请输入HUB编号',
      //   append: '工分/单'
      // },
      // {
      //   label: '站位费',
      //   name: 'parkingPrice',
      //   type: 'number',
      //   placeholder: '请输入HUB编号',
      //   append: '工分/单'
      // },
      // {
      //   label: '站位费',
      //   name: 'parkingPrice',
      //   type: 'number',
      //   placeholder: '请输入HUB编号',
      //   append: '工分/单'
      // },
      // {
      //   label: '站位费',
      //   name: 'parkingPrice',
      //   type: 'number',
      //   placeholder: '请输入HUB编号',
      //   append: '工分/单'
      // },
      // {
      //   label: '清洁单',
      //   name: 'clean',
      //   type: 'number',
      //   placeholder: '请输入HUB编号',
      //   append: '工分/单',
      //   type: 'slot'
      // },
      // {
      //   label: '调度单（调度单工分 = 每单工分 + 阶梯工分配置）',
      //   name: 'parkingPrice',
      //   type: 'number',
      //   placeholder: '请输入HUB编号',
      //   append: '工分/单',
      //   type: 'slot'
      // }
    ]
  },
  {
    label: '充电单',
    items: [
      {
        label: '充电单',
        name: 'chargeCarScore',
        type: 'number',
        placeholder: '请输入充电单工分',
        append: '工分/单',
        defineMessage: '充电单每单工分',
        required: true,
        min:0
      }
    ]
  },
  {
    label: '巡检单',
    items: [
      {
        label: '巡检单',
        name: 'inspectCarScore',
        type: 'number',
        placeholder: '请输入巡检单工分',
        append: '工分/单',
        defineMessage: '巡检单每单工分',
        required: true,
        min: 0
      }
    ]
  },
  {
    label: '维修单',
    items: [
      {
        label: '维修单',
        name: 'repairCarScore',
        type: 'number',
        placeholder: '请输入维修单工分',
        append: '工分/单',
        defineMessage: '维修单每单工分',
        required: true,
        min: 0
      }
    ]
  },
  {
    label: '补料单',
    items: [
      {
        label: '补料单',
        name: 'lockCarScore',
        type: 'number',
        placeholder: '请输入补料单工分',
        append: '工分/单',
        defineMessage: '补料单每单工分',
        required: true,
        min: 0
      }
    ]
  },
  {
    label: '清洁单',
    items: [
      {
        label: '全车',
        name: 'cleanAllCarScore',
        type: 'number',
        placeholder: '请输入全车工分',
        append: '工分/单',
        defineMessage: '全车每单工分',
        required: true,
        min: 0
      },
      {
        label: '车内',
        name: 'cleanInsideCarScore',
        type: 'number',
        placeholder: '请输入车内工分',
        append: '工分/单',
        defineMessage: '车内每单工分',
        required: true,
        min: 0
      },
      {
        label: '车外',
        name: 'cleanOutCarScore',
        type: 'number',
        placeholder: '请输入车外工分',
        append: '工分/单',
        defineMessage: '车外每单工分',
        required: true,
        min: 0
      }
    ]
  },
  {
    label: '调度单',
    items: [
      {
        label: '调度单',
        name: 'dispatchCarScore',
        type: 'number',
        placeholder: '请输入调度单工分',
        append: '工分/单',
        defineMessage: '调度单每单工分',
        required: true,
        min: 0
      },
      {
        label: '',
        name: 'dispatchScoreRules',
        type: 'slot',
        required: true
      }
    ]
  }
]
