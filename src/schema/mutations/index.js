import user from "./user"
import authentication from "./authentication"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  user,
  authentication,
)
