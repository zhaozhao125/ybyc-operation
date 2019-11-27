import { serviceCar } from '@/config/base-url'
export default {
  // 添加工分
  ADD_POINT: '/service-ratchet/ratchet/taskScore/create',
  // 工分列表查询
  WORKER_POINT_LIST: '/service-ratchet/ratchet/taskScore/pageList',
  // 工分详情
  POINT_INFOR: '/service-ratchet/ratchet/taskScore/info',
  // 工分修改
  POINT_EDIT: '/service-ratchet/ratchet/taskScore/edit',
  // 删除工分
  DELETE_POINT: '/service-ratchet/ratchet/taskScore/delete',
  // 根据城市获取工分规则
  CITY_POINT: '/service-ratchet/ratchet/taskScore/listAll',
  POINT_STATISTIC: '/service-ratchet/ratchet/taskScore/listCollect',
  // 导出工分汇总
  EXPORT_POINT: 'optimus/ratchet/taskScore/export'
}
