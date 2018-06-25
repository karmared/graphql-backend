import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `
  input SignStringInput {
    string: String!
    privateKey: String!
  }


  type SignStringPayload {
    status: Boolean!
    string: String!
  }


  extend type Mutation {
    signString(input: SignStringInput!): SignStringPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "sign_string",
    data: {
      string: input.string,
      key: input.privateKey,
    }
  }
}


const signString = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))

  return {
    status: response.status,
    string: response.data.signed_string,
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      signString
    }
  }
)
