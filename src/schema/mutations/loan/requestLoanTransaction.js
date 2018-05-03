import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `
  input RequestLoanTransactionAssetInput {
    amount: Int!
    assetId: ID!
  }

  input RequestLoanTransactionInput {
    userId: ID!
    period: Int!
    interest: Int!
    memo: String!
    loan: RequestLoanTransactionAssetInput!
    collateral: RequestLoanTransactionAssetInput!
  }

  type RequestLoanTransactionPayload {
    status: Boolean!
    transaction: String!
  }

  extend type Mutation {
    requestLoanTransaction(
      input: RequestLoanTransactionInput!
    ): RequestLoanTransactionPayload!
  }
`


const payloadFromInput = input => {
  return {
    user_id: input.userId,
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


const requestLoanTransaction = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status,
    transaction: response.tran.toString("base64"),
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      requestLoanTransaction
    }
  }
)
