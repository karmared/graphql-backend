import store from "/store"
import Schema, { connectionFromIdsArray } from "/graphql-schema"


const definition = /* GraphQL */`

  type ProfileEdge {
    node: Profile!
    cursor: Cursor!
  }

  type ProfileConnection {
    count: Int!
    edges: [ProfileEdge!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    profiles(
      first: Int
      after: Cursor
    ): ProfileConnection!
  }

`


const idsQuery_Pending = async () => {
  const connection = await store.connect()

  return store.table("user_profiles")
    .filter(profile =>
      profile("bankAccounts")
        .default([])
        .filter(account => account("approved_at").default(null).eq(null))
        .isEmpty()
        .not()
    )("id")
    .run(connection)
    .then(cursor => cursor.toArray())
    .then(ids => {
      connection.close()
      return ids
    })
    .catch(error => {
      connection.close()
      throw error
    })
}


const profiles = async (root, { first, after }, { viewer }) => {
  const ids = await idsQuery_Pending()
  return connectionFromIdsArray(ids, { first, after })
}


const profileEdgeNode = (edge, args, { viewer }, { schema }) => {
  return schema.getType("Profile").fetch(edge.id)
}


const profileEdgeCursor = edge => {
  return edge.id
}


Schema.add(
  Schema.BackOffice,
  definition,
  {
    Query: {
      profiles
    },
    ProfileEdge: {
      node: profileEdgeNode,
      cursor: profileEdgeCursor,
    }
  }
)
