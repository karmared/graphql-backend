import schema from "/schema"
import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  extend type Query {
    loans(
      walletId: ID
    ): [Loan!]!
  }
`


const loans = async (root, { walletId }) => {
  const ids = [walletId].filter(Boolean)

  const response = await chainFetch({
    oper: "get_credit_request_ids",
    filter: {
      user_ids: ids,
    }
  })
  const Loan = schema.getType("Loan")
  return response.data.credit_request_ids.map(id => Loan.fetch(id))
}


export default createDefinition(
  definition,
  {
    Query: {
      loans
    }
  }
)
