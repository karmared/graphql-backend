import acceptLoan from "./acceptLoan"
import cancelLoan from "./cancelLoan"
import redeemLoan from "./redeemLoan"
import requestLoan from "./requestLoan"
import transferFunds from "./transferFunds"
import { collectDefinitions } from "/schema/utils"


const definition = `
  input AssetInput {
    amount: Float!
    assetId: ID!
  }
`


export default collectDefinitions(
  { definition },
  acceptLoan,
  cancelLoan,
  redeemLoan,
  requestLoan,
  transferFunds,
)
