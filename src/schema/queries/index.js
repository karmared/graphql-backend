import node from "./node"
import viewer from "./viewer"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  node,
  viewer,
)
