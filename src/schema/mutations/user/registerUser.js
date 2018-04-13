import store from "/store"
import { graphql } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `

  input RegisterUserInput {
    email: String!
  }

  type RegisterUserPayload {
    status: Boolean!
  }

  extend type Mutation {
    registerUser(input: RegisterUserInput!): RegisterUserPayload!
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


const createTokenQuery = `
  query q($attributes: String!) {
    collection(name: "tokens") {
      create(attributes: $attributes)
    }
  }
`


const getTokenQuery = `
  query q($id: ID!) {
    collection(name: "tokens") {
      get(id: $id) {
        attributes
      }
    }
  }
`


const registerUser = async (root, { input }) => {
  const id = await graphql({
    query: getUserIdQuery,
    variables: { email: input.email }
  }).then(data => data.collection.getIdByEmail)

  if (id !== null)
    throw new Error("User exists")

  const tokenId = await graphql({
    query: createTokenQuery,
    variables: {
      attributes: JSON.stringify({
        kind: "register",
        user: {
          email: input.email
        }
      })
    }
  }).then(data => data.collection.create)

  const token = await store.node("tokens", tokenId)

  // Send token to mailer

  return {
    status: true
  }
}


export default createDefinition(
  definition, {
    Mutation: {
      registerUser
    }
  }
)
