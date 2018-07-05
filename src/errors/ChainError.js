import { GraphQLError } from "graphql"


class ChainError extends GraphQLError {
  constructor(error) {
    super("Chain error")
    this.chain = error
  }
}


export default ChainError
