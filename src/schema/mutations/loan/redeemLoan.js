import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  input RedeemLoanInput {
    userId: ID!
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
    user_id: input.userId,
    request_id: fromGlobalId(input.loanId).id,
  }
}


const redeemLoan = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))
  return {
    status: response.status,
    transaction: response.data.tran.toString("base64"),
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
