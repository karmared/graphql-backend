import "/env"
import schema from "/schema"
import server from "server"
import expressCors from "cors"
import graphqlHTTP from "express-graphql"
import { authorization } from "/utils"

import "/mailer"

const options = {
  session: false,
  security: false,
}


const cors = server.utils.modern(expressCors({}))


const graphql = server.utils.modern(graphqlHTTP(req => {
  return {
    schema,
    graphiql: true,
    formatError: error => ({
      path: error.path,
      message: error.message,
      locations: error.locations,
      validations: error.originalError.validations,
    })
  }
}))


server(
  options,
  cors,
  authorization,
  server.router.post("/graphql", graphql),
  server.router.get("/graphql", graphql),
  ctx => 200,
).then(({ options }) => {
  console.log(`Karma.Red GraphQL server started on port ${ options.port }`)
})
