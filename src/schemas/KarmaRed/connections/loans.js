import { chainFetch } from "/transport"
import schema, { connectionFromIdsArray } from "/graphql-schema"


const definition = /* GraphQL */`
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
    loans(
      first: Int
      after: Cursor
      walletIds: [ID!] = []
    ): LoanConnection!
  }

  extend type User {
    loans(
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
  const walletIds = (user.wallets || []).map(wallet => wallet.id)

  if (walletIds.length === 0)
    return connectionFromIdsArray([], { first, after })

  return query_loans(null, { first, after, walletIds })
}


const loanEdgeNode = edge => {
  const Loan = schema.getType("Loan")
  return Loan.fetch(edge.id)
}


const loanEdgeCursor = edge => {
  return edge.id
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Query: {
      loans: query_loans,
    },

    User: {
      loans: user_loans,
    },

    LoanEdge: {
      node: loanEdgeNode,
      cursor: loanEdgeCursor,
    }
  }
)
