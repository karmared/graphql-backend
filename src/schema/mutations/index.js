import loan from "./loan"
import user from "./user"
import transaction from "./transaction"
import authentication from "./authentication"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  loan,
  user,
  transaction,
  authentication,
)
