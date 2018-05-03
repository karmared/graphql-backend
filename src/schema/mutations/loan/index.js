import signLoanTransaction  from "./signLoanTransaction"
import requestLoanTransaction from "./requestLoanTransaction"
import broadcastLoanTransaction from "./broadcastLoanTransaction"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  signLoanTransaction,
  requestLoanTransaction,
  broadcastLoanTransaction,
)
