import { servicePhp } from '@/config/base-url'

export default {
  getFeedbackproblemTypes: `${servicePhp}user/user-feedback-problem/get-problem-type`,
  getFeedbackProblemList: `${servicePhp}user/user-feedback-problem/list`,
  closeFeedbackpro:`${servicePhp}user/jpush-msg/send-user-message`,
  changeFeedbackpro:`${servicePhp}user/user-feedback-problem/change-feedbackpro`,
}
