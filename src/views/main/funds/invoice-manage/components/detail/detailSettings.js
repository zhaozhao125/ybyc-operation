export const settings = ststus => {
  console.log(ststus, 'ststus')
  return [
    {
      label: '基本信息',
      items: [
        {
          label: '流水号',
          value: 'sn'
        },
        {
          label: '状态',
          value: 'status',
          type: 'slot'
        },
        {
          label: '城市',
          value: 'cityName',
          type: 'text'
        },
        {
          label: '用户名',
          value: 'userName'
        },
        {
          label: '手机号',
          value: 'userPhone'
        }
      ]
    },
    {
      label: '开票信息',
      items: [
        {
          label: '发票金额',
          value: 'money'
        },
        {
          label: '抬头类型',
          value: 'titleType'
        },
        {
          label: '发票抬头',
          value: 'title'
        },
        {
          label: '税号',
          value: 'taxNumber'
        },
        {
          label: '发票内容',
          value: 'content'
        },
        {
          label: '电子邮箱',
          value: 'email'
        }
      ]
    },
    {
      label: '开票订单',
      items: [
        {
          label: '',
          value: 'relationOrders',
          type: 'slot'
        }
      ]
    },
    {
      label: '其他信息',
      items: [
        {
          label: '申请时间',
          value: 'applyTime',
          type: 'time'
        },
        {
          label: '处理人',
          value: 'operatorCn',
          visibleControl: status === 'processed'
        },
        {
          label: '处理时间',
          value: 'handleTime',
          type: 'time',
          visibleControl: status === 'processed'
        }
      ]
    }
  ]
}
