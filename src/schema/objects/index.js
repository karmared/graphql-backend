import loan from "./loan"
import user from "./user"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  loan,
  user,
)
