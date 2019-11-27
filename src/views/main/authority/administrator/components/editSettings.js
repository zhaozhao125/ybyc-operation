// export default {
//  /* cnName: {
//     label: '姓名',
//     required: true
//   },
//   mobilePhone: {
//     label: '手机号',
//     required: true
//   },
//   email: {
//     label: '邮箱'
//   },*/
//   roleId: {
//     label: '角色',
//     required: true,
//     options: []
//   },
//   statusVal: {
//     label: '状态',
//     required: true,
//     type: 'switch'
//   },
//   cities: {
//     label: '城市权限',
//     required: true,
//     options
//   }
// }

export default [
  {
    label: '',
    items: [
      {
        label: '角色',
        name: 'roleId',
        type: 'select',
        required: true,
        options: []
      },
      {
        label: '状态',
        name: 'statusVal',
        required: true,
        type: 'switch',
        trueValue: 1
      },
      {
        label: '城市权限',
        type: 'slot',
        name: 'cities',
        value: [],
        required: true
      }
    ]
  }
]
