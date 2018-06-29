import { globalIdField, createDefinition } from "/schema/utils"


const definition = `
  type User implements Node {
    id: ID!
    email: String!

    shouldProvidePassword: Boolean!
    shouldLoginWithOTPAuth: Boolean

    profiles: [UserProfile!]!
  }
`


const shouldProvidePassword = user => {
  return user.password === null || user.password === void 0
}


const profiles = user => {
  return []
}


export default createDefinition(
  definition,
  {
    User: {
      id: globalIdField(),
      shouldProvidePassword,
      profiles,
    }
  }
)
