import store from "/store"
import { jwtSign } from "/utils"
import { graphql } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `
  input LoginWithAuthenticationTokenInput {
    token: String!
  }

  type LoginWithAuthenticationTokenPayload {
    token: String!
  }

  extend type Mutation {
    loginWithAuthenticationToken(
      input: LoginWithAuthenticationTokenInput!
    ): LoginWithAuthenticationTokenPayload
  }
`


const createUserQuery = `
  query q($attributes: String!) {
    collection(name: "users") {
      create(attributes: $attributes)
    }
  }
`


const createUser = async attributes => {
  return store.node.create("users", attributes).catch(error => null)
}


const loginWithAuthenticationToken = async (root, { input }) => {
  const token = await store.node("tokens", input.token)

  if (token === null)
    throw new Error("Token not found")

  const id = token.user.id || await createUser({ email: token.user.email })
  const user = await store.node("users", id)

  await store.node.update("tokens", token.id, { activated_at: new Date })

  if (user === null)
    throw new Error("User not found")

  return {
    token: jwtSign({ sub: user.id, iss: "Karma.Red" })
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      loginWithAuthenticationToken
    }
  }
)
