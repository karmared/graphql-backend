import "/env"
import "/schemas"
import server from "server"
import expressCors from "cors"
import graphqlHTTP from "express-graphql"
import GraphQLSchema from "/graphql-schema"
import { authorization } from "/utils"


const KarmaRedGraphQLSchema = GraphQLSchema.get(GraphQLSchema.KarmaRed)
const BackOfficeGraphQLSchema = GraphQLSchema.get(GraphQLSchema.BackOffice)

const options = {
  session: false,
  security: false,
}


const cors = server.utils.modern(expressCors({}))


const formatError = error => ({
  path: error.path,
  message: error.message,
  locations: error.locations,
  chain: error.originalError && error.originalError.chain,
  validations: error.originalError && error.originalError.validations,
  authorization: error.originalError && error.originalError.authorization,
})


const KarmaRedGraphQL =server.utils.modern(graphqlHTTP(req => {
  return {
    schema: KarmaRedGraphQLSchema,
    graphiql: true,
    formatError
  }
}))


const BackOfficeGraphQL =server.utils.modern(graphqlHTTP(req => {
  return {
    schema: BackOfficeGraphQLSchema,
    graphiql: true,
    formatError
  }
}))



server(
  options,
  cors,
  authorization,

  server.router.get("/graphql", KarmaRedGraphQL),
  server.router.post("/graphql", KarmaRedGraphQL),

  server.router.get("/graphql/back-office", BackOfficeGraphQL),
  server.router.post("/graphql/back-office", BackOfficeGraphQL),

  ctx => 200,
).then(({ options }) => {
  console.log(`Karma.Red GraphQL server started on port ${ options.port }`)
})
