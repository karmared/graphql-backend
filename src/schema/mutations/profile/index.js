import removeProfile from "./removeProfile"
import createIndividualProfile from "./createIndividualProfile"
import updateIndividualProfile from "./updateIndividualProfile"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  removeProfile,
  createIndividualProfile,
  updateIndividualProfile,
)
