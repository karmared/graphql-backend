import loan from "./loan"
import user from "./user"
import upload from "./upload"
import profile from "./profile"
import transaction from "./transaction"
import authentication from "./authentication"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  loan,
  user,
  upload,
  profile,
  transaction,
  authentication,
)
