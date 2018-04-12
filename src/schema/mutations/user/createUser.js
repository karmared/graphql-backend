import { graphql } from "/utils/kafka"
import { createDefinition } from "/schema/utils"


const definition = `

  input CreateUserInput {
    name: String!
    email: String!
  }

  type CreateUserPayload {
    id: ID!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload!
  }

`


const query = `
  mutation m($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      errors
    }
  }
`


const createUser = async (root, { input }) => {
  const { id, errors } = await graphql({
    query,
    variables: { input }
  }).then(({ createUser }) => createUser)

  console.log(id, errors)

  return {
    id
  }
}


export default createDefinition(
  definition, {
    Mutation: {
      createUser
    }
  }
)
