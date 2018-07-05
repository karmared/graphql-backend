import is from "is_js"
import { GraphQLError } from "graphql"


export default class AuthorizationError extends GraphQLError {
  constructor({ model, action, target }) {
    super('Authorization error')

    this.authorization = {
      model: is.existy(model) ? { id: model.id, type: model.__type } : model,
      target: is.existy(target) ? { id: target.id, type: target.__type } : target,
      action,
    }
  }
}
