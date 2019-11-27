export default [
  {
    label: '',
    items: [
      {
        label: '充值卡名称',
        name: 'name',
        required: true,
        type: 'text',
        maxlength: 20,
        placeholder: '请输入充值卡名称'
      },
      // {
      //   label: '面值',
      //   name: 'faceValue',
      //   type: 'number',
      //   controls: false,
      //   min: 0,
      //   max: 99999999,
      //   append: '元',
      //   required: true
      // },
      {
        label: '面值',
        name: 'faceValue',
        required: true,
        type: 'slot',
        value: undefined
      },
      {
        label: '发行张数',
        name: 'issueNumber',
        required: true,
        type: 'slot',
        value: undefined
        // min: 1,
        // max: 99999999,
        // append: '张',
        // controles: false
      },
      {
        label: '每人使用次数',
        name: 'useCountLimit',
        type: 'slot',
        required: true
        // append: '次',
        // controles: false
      },
      {
        label: '用户所属城市',
        type: 'city',
        name: 'cityPermitIds',
        multiple: true,
        enableAuth: true,
        enableAllCity: true,
        clearable: true,
        required: true
      },
      {
        label: '发行有效期',
        name: 'sendingTime',
        type: 'datetimerange',
        required: true,
        // unixTime: true,
        defaultTime: ['00:00:00', '23:59:59']
      },
      {
        label: '状态',
        name: 'couldUse',
        type: 'switch',
        value: true
      },
      {
        label: '备注',
        name: 'remark',
        type: 'textarea'
      }
    ]
  }
]
