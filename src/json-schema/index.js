import Ajv from "ajv"
import schemas from "./schemas"


const validator = new Ajv({
  $data: true,
  $async: true,
  messages: false,
  allErrors: true,
  jsonPointers: true,
  removeAdditional: true,
  schemas,
})


export default validator
