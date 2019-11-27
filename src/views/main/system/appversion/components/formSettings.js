export default [
  {
    items: [
      {
        label: 'app类型',
        name: 'app_type',
        type: 'radio',
        options: [
          {
            label: '用车iOS',
            value: '1'
          },
          {
            label: '用车Android',
            value: '2'
          },
          {
            label: '车服iOS',
            value: '3'
          },
          {
            label: '车服Android',
            value: '4'
          }
        ],
        value: '1'
      },
      {
        label: 'app显示版本号',
        name: 'app_show_version_number',
        type: 'text',
        events: {
          change: 'typeChange'
        },
        required: true,
        placeholder: 'v2'
      },
      {
        label: '升级对应版本号',
        name: 'app_version_number',
        type: 'text',
        required: true,
        placeholder: '200'
      },
      {
        label: '是否强制更新',
        name: 'is_force_update',
        type: 'radio',
        options: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ],
        value: '1'
      },
      {
        label: '是否文件',
        name: 'is_file',
        type: 'radio',
        value: '1',
        disabled: false,
        options: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ],
        events: {
          change: 'fileurlchange'
        }
      },
      {
        label: '上传文件',
        name: 'file',
        type: 'file',
        multiple: true,
        limit: 1,
        hidden: false,
        noRename: true,
        disabled: false
      },
      {
        label: '版本文件路径',
        name: 'app_version_url',
        type: 'text',
        hidden: true
      },
      {
        label: '版本描述',
        name: 'app_version_description',
        type: 'textarea',
        required: true
      },
      {
        label: '版本文件大小',
        name: 'app_version_file_size',
        type: 'text',
        required: true
      },
      {
        label: '版本状态',
        name: 'app_version_status',
        type: 'radio',
        options: [
          {
            label: '启用',
            value: '1'
          },
          {
            label: '禁用',
            value: '0'
          }
        ],
        value: '1'
      }
    ]
  }
]
