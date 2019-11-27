export default [
  {
    label: '标题',
    type: 'text',
    name: 'title',
    visible: true
  },
  {
    label: '启用',
    type: 'select',
    name: 'isEnabled',
    options: [
      {
        label: '是',
        value: true
      },
      {
        label: '否',
        value: false
      }
    ],
    visible: true
  },
  {
    label: '置顶',
    type: 'select',
    name: 'isPinned',
    options: [
      {
        label: '是',
        value: true
      },
      {
        label: '否',
        value: false
      }
    ],
    visible: false
  }
]
