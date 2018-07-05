import schema from "/graphql-schema"
import { base64 } from "/utils"
import { chainFetch } from "/transport"


const definition = /* GraphQL */`
  input RequestLoanInput {
    walletId: ID!
    period: Int!
    interest: Int!
    memo: String!
    loan: AssetInput!
    collateral: AssetInput!
  }

  type RequestLoanPayload {
    status: Boolean!
    transaction: String!
  }

  extend type Mutation {
    requestLoan(
      input: RequestLoanInput!
    ): RequestLoanPayload!
  }
`


const payloadFromInput = input => {
  return {
    user_id: input.walletId,
    oper: "credit_request_operation",
    data: {
      period: input.period,
      interest: input.interest,
      memo: input.memo,
      loan: {
        amount: input.loan.amount,
        asset_id: input.loan.assetId,
      },
      collateral: {
        amount: input.collateral.amount,
        asset_id: input.collateral.assetId,
      }
    }
  }
}


const requestLoan = async (root, { input }) => {
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
      requestLoan
    }
  }
)
