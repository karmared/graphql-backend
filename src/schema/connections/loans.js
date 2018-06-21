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
    pageInfo: PageInfo!
    edges: [LoanEdge!]!
  }

  extend type Query {
    _loans(
      first: Int
      after: Cursor
      walletIds: [ID!] = []
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

  return connectionFromIdsArray(
    ids, { first, after }
  )
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
      _loans: query_loans
    },

    LoanEdge: {
      node: loanEdgeNode,
      cursor: loanEdgeCursor,
    }
  }
)
