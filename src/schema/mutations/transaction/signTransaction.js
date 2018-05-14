import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `
  input SignTransactionInput {
    userId: ID!
    transaction: String!
    privateKey: String!
  }


  type SignTransactionPayload {
    status: Boolean!
    transaction: String!
  }


  extend type Mutation {
    signTransaction(
      input: SignTransactionInput!
    ): SignTransactionPayload!
  }
`


const payloadFromInput = input => {
  return {
    user_id: input.userId,
    oper: "sign_transaction",
    data: {
      tran: Buffer.from(input.transaction, "base64"),
      key: input.privateKey,
    }
  }
}


const signTransaction = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status,
    transaction: response.signed_tran.toString("base64"),
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      signTransaction,
    }
  }
)
