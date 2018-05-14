import acceptLoan from "./acceptLoan"
import cancelLoan from "./cancelLoan"
import fulfillLoan from "./fulfillLoan"
import requestLoan from "./requestLoan"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  acceptLoan,
  cancelLoan,
  fulfillLoan,
  requestLoan,
)
