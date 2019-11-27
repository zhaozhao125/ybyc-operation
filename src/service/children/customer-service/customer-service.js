import recommendStation from './recommend-station.js' // 用户反馈
import userfeedback from "../user/userfeedback";
import userfeedbackproblem from "../user/userfeedbackproblem";


export default {
  ...recommendStation,
  ...userfeedback,
  ...userfeedbackproblem
}
