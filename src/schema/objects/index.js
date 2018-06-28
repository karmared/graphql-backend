import loan from "./loan"
import user from "./user"
import asset from "./asset"
import wallet from "./wallet"
import individualProfile from "./individual_profile"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  loan,
  user,
  asset,
  wallet,
  individualProfile,
)
