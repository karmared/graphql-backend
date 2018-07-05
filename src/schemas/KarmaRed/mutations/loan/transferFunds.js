import { base64 } from "/utils"
import { chainFetch } from "/transport"
import schema, { fromGlobalId } from "/graphql-schema"


const definition = /* GraphQL */`
  input TransferFundsInput {
    senderWalletId: ID!
    recipientWalletId: ID!
    funds: AssetInput!
    memo: String
  }


  type TransferFundsPayload {
    status: Boolean!
    transaction: String!
  }


  extend type Mutation {
    transferFunds(
      input: TransferFundsInput!
    ): TransferFundsPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "create_transfer",
    user_wallet_id: input.senderWalletId,
    data: {
      memo: input.memo,
      amount: input.funds.amount,
      asset_id: input.funds.assetId,
      recipient_wallet_id: input.recipientWalletId,
    }
  }
}


const transferFunds = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status,
    transaction: base64.enc(response.data.tran),
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      transferFunds,
    }
  }
)
