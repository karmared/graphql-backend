import { globalIdField, createDefinition } from "/schema/utils"


const definition = `
  type User implements Node {
    id: ID!
    email: String!
    shouldProvidePassword: Boolean!
    shouldLoginWithOTPAuth: Boolean
  }
`


const shouldProvidePassword = user => {
  return user.password === null || user.password === void 0
}


export default createDefinition(
  definition,
  {
    User: {
      id: globalIdField(),
      shouldProvidePassword,
    }
  }
)
