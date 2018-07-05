import schema from "/graphql-schema"


const definition = /* GraphQL */`
  extend type Query {
    viewer: User
  }
`


const viewer = (root, args, { viewer }) => viewer


schema.add(
  schema.KarmaRed,
  definition,
  {
    Query: {
      viewer
    }
  }
)
