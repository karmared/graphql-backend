import { base64 } from "/utils"
import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  input AcceptLoanInput {
    userId: ID!
    loanId: ID!
  }


  type AcceptLoanPayload {
    status: Boolean!
    transaction: String!
  }


  extend type Mutation {
    acceptLoan(
      input: AcceptLoanInput!
    ): AcceptLoanPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "respond_credit_request",
    user_id: input.userId,
    request_id: fromGlobalId(input.loanId).id,
  }
}


const acceptLoan = async (root, { input }) => {
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
      acceptLoan,
    }
  }
)
