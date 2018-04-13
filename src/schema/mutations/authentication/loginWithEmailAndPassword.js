import store from "/store"
import { jwtSign } from "/utils"
import { graphql } from "/transport"
import { validatePassword } from "/utils"
import { createDefinition } from "/schema/utils"


const definition = `
  input LoginWithEmailAndPasswordInput {
    email: String!
    password: String!
  }

  type LoginWithEmailAndPasswordPayload {
    token: String!
  }

  extend type Mutation {
    loginWithEmailAndPassword(
      input: LoginWithEmailAndPasswordInput
    ): LoginWithEmailAndPasswordPayload!
  }
`


const getUserIdQuery = `
  query q($email: String!) {
    collection(name: "users") {
      ... on Users {
        getIdByEmail(email: $email)
      }
    }
  }
`


const loginWithEmailAndPassword = async (root, { input }) => {
  const id = await graphql({
    query: getUserIdQuery,
    variables: { email: input.email },
  }).then(data => data.collection.getIdByEmail)

  if (id === null)
    throw new Error("User not found")

  const user = await store.node("users", id)

  if (validatePassword(user.password, input.password) === false)
    throw new Error("User not found")

  return {
    token: jwtSign({ sub: user.id, iss: "Karma.Red" })
  }
}



export default createDefinition(
  definition,
  {
    Mutation: {
      loginWithEmailAndPassword,
    }
  }
)
