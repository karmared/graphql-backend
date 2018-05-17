import { base64 } from "/utils"
import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  input RedeemLoanInput {
    walletId: ID!
    loanId: ID!
  }


  type RedeemLoanPayload {
    status: Boolean!
    transaction: String!
  }


  extend type Mutation {
    redeemLoan(
      input: RedeemLoanInput!
    ): RedeemLoanPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "redeem_loan",
    user_id: input.walletId,
    request_id: fromGlobalId(input.loanId).id,
  }
}


const redeemLoan = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status,
    transaction: base64.enc(response.data.tran),
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      redeemLoan,
    }
  }
)
