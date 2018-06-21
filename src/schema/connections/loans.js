import schema from "/schema"
import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"
import { connectionFromIdsArray } from "/schema/connections/utils"


const definition = `
  type LoanEdge {
    node: Loan!
    cursor: Cursor!
  }

  type LoanConnection {
    count: Int!
    edges: [LoanEdge!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    _loans(
      first: Int
      after: Cursor
      walletIds: [ID!] = []
    ): LoanConnection!
  }

  extend type User {
    _loans(
      first: Int
      after: Cursor
    ): LoanConnection!
  }
`


const query_loans = async (root, { first, after, walletIds }) => {
  walletIds = [].concat(walletIds).filter(Boolean)

  let ids = await chainFetch({
    oper: "get_credit_request_ids",
    filter: {
      user_ids: walletIds,
    }
  }).then(response => response.data.credit_request_ids)

  return connectionFromIdsArray(ids, { first, after })
}


const user_loans = async (user, { first, after }) => {
  const walletIds = [] // fetch wallet ids for user
  return query_loans(null, { first, after, walletIds })
}


const loanEdgeNode = edge => {
  const Loan = schema.getType("Loan")
  return Loan.fetch(edge.id)
}


const loanEdgeCursor = edge => {
  return edge.id
}


export default createDefinition(
  definition,
  {
    Query: {
      _loans: query_loans,
    },

    User: {
      _loans: user_loans,
    },

    LoanEdge: {
      node: loanEdgeNode,
      cursor: loanEdgeCursor,
    }
  }
)
