import signTransaction  from "./signTransaction"
import broadcastTransaction from "./broadcastTransaction"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  signTransaction,
  broadcastTransaction,
)
