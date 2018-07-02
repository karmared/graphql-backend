import confirmPhone from "./confirmPhone"
import removeProfile from "./removeProfile"
import createIndividualProfile from "./createIndividualProfile"
import updateIndividualProfile from "./updateIndividualProfile"
import requestPhoneConfirmation from "./requestPhoneConfirmation"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  confirmPhone,
  removeProfile,
  createIndividualProfile,
  updateIndividualProfile,
  requestPhoneConfirmation,
)
