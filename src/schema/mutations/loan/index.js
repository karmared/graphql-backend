import acceptLoan from "./acceptLoan"
import cancelLoan from "./cancelLoan"
import redeemLoan from "./redeemLoan"
import requestLoan from "./requestLoan"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  acceptLoan,
  cancelLoan,
  redeemLoan,
  requestLoan,
)
