import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  input FulfillLoanInput {
    userId: ID!
    loanId: ID!
  }


  type FulfillLoanPayload {
    status: Boolean!
    transaction: String!
  }


  extend type Mutation {
    fulfillLoan(
      input: FulfillLoanInput!
    ): FulfillLoanPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "redeem_loan",
    user_id: input.userId,
    request_id: fromGlobalId(input.loanId).id,
  }
}


const fulfillLoan = async (root, { input }) => {
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
      fulfillLoan,
    }
  }
)
