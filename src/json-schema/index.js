import Ajv from "ajv"
import schemas from "./schemas"
import { ValidationError } from "/errors"


const validator = new Ajv({
  $data: true,
  $async: true,
  messages: false,
  allErrors: true,
  jsonPointers: true,
  removeAdditional: true,
  schemas,
})


const validate = (...args) => {
  return validator.validate(...args).catch(({ errors }) => {
    throw new ValidationError(errors)
  })
}


export default validator

export {
  validate
}
