import createIndividualProfile from "./createIndividualProfile"
import updateIndividualProfile from "./updateIndividualProfile"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  createIndividualProfile,
  updateIndividualProfile,
)
