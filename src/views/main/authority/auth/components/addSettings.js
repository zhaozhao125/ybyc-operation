export default {
  parentId: {
    label: '父级ID',
    disabled: true,
    hidden: true
  },
  parentName: {
    label: '父权限',
    disabled: true,
    fake: true
  },
  typeLevel: {
    label: '权限级别',
    type: 'select',
    options: [{
      label: '一级菜单',
      value: 1
    }, {
      label: '普通菜单',
      value: 2
    }, {
      label: '权限URL',
      value: 3
    }]
  },
  name: {
    label: '权限名',
    required: true
  },
  summary: {
    label: '描述',
    type: 'textarea'
  },
  url: {
    label: '权限url'
  },
  icon: {
    label: '图标'
  },
  orderVal: {
    label: '排序',
    type: 'number',
    placeholder: '菜单按该值升序排序'
  },
  marker: {
    label: '标记',
    required: true
  }
}
