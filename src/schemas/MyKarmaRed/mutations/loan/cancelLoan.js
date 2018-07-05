import { base64 } from "/utils"
import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  input CancelLoanInput {
    walletId: ID!
    loanId: ID!
  }


  type CancelLoanPayload {
    status: Boolean!
    transaction: String!
  }


  extend type Mutation {
    cancelLoan(
      input: CancelLoanInput!
    ): CancelLoanPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "cancel_credit_request",
    user_id: input.walletId,
    request_id: fromGlobalId(input.loanId).id,
  }
}


const cancelLoan = async (root, { input }) => {
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
      cancelLoan,
    }
  }
)
