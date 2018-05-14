import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `

  input BroadcastTransactionInput {
    userId: ID!
    transaction: String!
  }

  type BroadcastTransactionPayload {
    status: Boolean!
  }

  extend type Mutation {
    broadcastTransaction(
      input: BroadcastTransactionInput!
    ): BroadcastTransactionPayload!
  }

`


const payloadFromInput = input => {
  return {
    user_id: input.userId,
    oper: "broadcast_transaction",
    signed_tran: Buffer.from(input.transaction, "base64")
  }
}


const broadcastTransaction = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      broadcastTransaction,
    }
  }
)
