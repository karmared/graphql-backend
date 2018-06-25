import signString from "./signString"
import signTransaction  from "./signTransaction"
import broadcastTransaction from "./broadcastTransaction"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  signString,
  signTransaction,
  broadcastTransaction,
)
