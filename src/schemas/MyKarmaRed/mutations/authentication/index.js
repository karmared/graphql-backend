import loginWithEmailAndPassword from "./loginWithEmailAndPassword"
import loginWithAuthenticationToken from "./loginWithAuthenticationToken"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  loginWithEmailAndPassword,
  loginWithAuthenticationToken,
)
