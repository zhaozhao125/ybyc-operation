export default [
  {
    label: '',
    items: [
      {
        label: '角色名',
        name: 'roleName',
        type: 'text',
        required: true
      },
      {
        label: '运营城市',
        name: 'city',
        type: 'remoteCity',
        integratedValue: true,
        placeholder: '请选择运营城市',
        isShowAll: false,
        events: {
          change: 'changeCity'
        },
        required: true
      },
      {
        label: '工分规则',
        name: 'ruleId',
        type: 'select',
        required: true,
        options: []
      },
      {
        label: '有无发单权限',
        name: 'hasCreateAuth',
        type: 'radio',
        required: true,
        value: true,
        options: [
          {
            label: '有',
            value: true
          },
          {
            label: '无',
            value: false
          }
        ],
        events: {
          change: 'handleSendChange'
        }
      },
      {
        label: '发单权限',
        name: 'taskCreateAuthList',
        type: 'slot',
        value: [],
        required: true,
        hidden: false
      },
      {
        label: '发单车辆权限配置',
        name: 'carAuthScopeOnCreate',
        type: 'radio',
        required: true,
        hidden: false,
        value: 'district',
        options: [
          {
            label: '按片区',
            value: 'district'
          },
          {
            label: '按网点',
            value: 'station'
          }
        ]
      },
      {
        label: '有无接单权限',
        name: 'hasAcceptAuth',
        type: 'radio',
        required: true,
        value: true,
        options: [
          {
            label: '有',
            value: true
          },
          {
            label: '无',
            value: false
          }
        ],
        events: {
          change: 'handleAcceptChange'
        }
      },
      {
        label: '接单权限',
        name: 'taskAcceptAuthList',
        type: 'slot',
        value: [],
        required: true,
        hidden: false
      },
      {
        label: '接单车辆权限配置',
        name: 'carAuthScopeOnAccept',
        type: 'radio',
        required: true,
        hidden: false,
        value: 'district',
        options: [
          {
            label: '按片区',
            value: 'district'
          },
          {
            label: '按网点',
            value: 'station'
          }
        ]
      },
      {
        label: '抢单权重',
        name: 'grabPriority',
        type: 'slot',
        value: 0,
        required: true,
        hidden: false
      },
      {
        label: '有无签到权限',
        name: 'hasSignAuth',
        type: 'radio',
        required: true,
        value: true,
        options: [
          {
            label: '有',
            value: true
          },
          {
            label: '无',
            value: false
          }
        ]
      },
      {
        label: '角色描述',
        name: 'detail',
        type: 'textarea',
        required: true
      }
    ]
  }
]
