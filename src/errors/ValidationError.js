import { GraphQLError } from "graphql"


class ValidationError extends GraphQLError {
  constructor(validations) {
    super("Validation error")
    this.validations = [].concat(validations)
  }
}


export default ValidationError
