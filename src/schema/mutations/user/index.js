import registerUser from "./registerUser"
import resetPassword from "./resetPassword"
import setViewerPassword from "./setViewerPassword"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  registerUser,
  resetPassword,
  setViewerPassword,
)
