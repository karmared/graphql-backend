import node from "./node"
import loans from "./loans"
import viewer from "./viewer"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  node,
  loans,
  viewer,
)
