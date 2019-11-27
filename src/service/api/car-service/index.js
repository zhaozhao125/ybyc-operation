import workorder from './workorder'
import operationsUser from './operations-user'
import operationsRole from './operations-role'
import moveRecord from './move-record'
import signin from './signin'
import inspectionRecord from './inspection-record'
import carDispatch from './car-dispatch'
import workpoints from './workpoints'
export default {
  ...workorder,
  ...operationsUser,
  ...operationsRole,
  ...moveRecord,
  ...signin,
  ...inspectionRecord,
  ...carDispatch,
  ...workpoints
}
