import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `

  input BroadcastLoanTransactionInput {
    userId: ID!
    transaction: String!
  }

  type BroadcastLoanTransactionPayload {
    status: Boolean!
  }

  extend type Mutation {
    broadcastLoanTransaction(
      input: BroadcastLoanTransactionInput!
    ): BroadcastLoanTransactionPayload!
  }

`


const payloadFromInput = input => {
  return {
    user_id: input.userId,
    oper: "broadcast_transaction",
    signed_tran: Buffer.from(input.transaction, "base64")
  }
}


const broadcastLoanTransaction = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      broadcastLoanTransaction,
    }
  }
)
