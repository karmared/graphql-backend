import { chainFetch } from "/transport"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  extend type Query {
    loans: [Loan!]!
  }
`


const loans = async root => {
  const response = await chainFetch({
    oper: "get_credit_request_ids",
    filter: {
      user_ids: [],
    }
  })
  return response.credit_request_ids.map(id => ({ id }))
}


export default createDefinition(
  definition,
  {
    Query: {
      loans
    }
  }
)
