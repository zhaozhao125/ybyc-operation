export default [
  {
    label: '',
    items: [
      {
        label: '标题',
        name: 'title',
        type: 'text',
        required: true
      },
      {
        label: '内容',
        name: 'content',
        type: 'slot',
        required: true
      },
      {
        label: '封面图片',
        name: 'previewImage',
        type: 'img',
        required: true,
        limit: 1,
        multiple: false,
        maxSize: 200,
        tip: ['图片大小不能超过200k']
      },
      {
        label: '封面文字',
        name: 'previewText',
        type: 'textarea'
      },
      {
        label: '文章作者',
        name: 'author',
        type: 'text',
        required: true
      },
      {
        label: '发布时间',
        name: 'releaseTime',
        type: 'date',
        required: true
      },
      {
        label: '是否原创',
        name: 'isOriginal',
        type: 'switch',
        required: true
      },
      {
        label: '是否置顶',
        name: 'isPinned',
        type: 'switch',
        required: true
      },
      {
        label: '是否启用',
        name: 'isEnabled',
        type: 'switch',
        required: true
      }
    ]
  }
]
