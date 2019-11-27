import { serviceUser } from '@/config/base-url'
export default {
  // 推广员分页查询
  PROMOTER_LIST: `${serviceUser}promotion/userRedPacket/userMarketingPromoter/page`,
  // 获取添加推广员用户列表
  PROMOTER_CUSTOMER_LIST: `${serviceUser}promotion/userRedPacket/userMarketingPromoter/userPage`,
  // 添加推广员
  ADD_PROMOTER: `${serviceUser}promotion/userRedPacket/userMarketingPromoter/addBatch`,
  // 删除推广员
  DELETE_PROMOTER: `${serviceUser}promotion/userRedPacket/userMarketingPromoter/deleteBatch`
}
