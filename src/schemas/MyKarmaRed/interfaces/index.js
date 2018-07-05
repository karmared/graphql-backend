import node from "./node"
import userProfile from "./userProfile"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  node,
  userProfile,
)
