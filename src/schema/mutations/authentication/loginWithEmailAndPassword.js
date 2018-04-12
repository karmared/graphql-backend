import { jwtSign } from "/utils"
import { graphql } from "/transport"
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
    getUserIdByEmail(email: $email)
  }
`


const validateUserPasswordQuery = `
  query q($id: ID!, $password: String!) {
    validateUserPassword(id: $id, password: $password)
  }
`


const loginWithEmailAndPassword = async (root, { input }) => {
  const id = await graphql({
    query: getUserIdQuery,
    variables: { email: input.email }
  }).then(({ getUserIdByEmail }) => getUserIdByEmail)

  if (id === null)
    throw new Error("User not found")

  const valid = await graphql({
    query: validateUserPasswordQuery,
    variables: { id, password: input.password }
  }).then(({ validateUserPassword }) => validateUserPassword)

  if (valid === false)
    throw new Error("User not found")

  const token = jwtSign({ sub: id })

  return {
    token
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
