import schema from "/graphql-schema"
import { chainFetch } from "/transport"


const definition = /* GraphQL */`

  input BroadcastTransactionInput {
    walletId: ID!
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
    user_id: input.walletId,
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


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      broadcastTransaction,
    }
  }
)
