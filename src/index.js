import "/env"
import schema from "/schema"
import server from "server"
import graphqlHTTP from "express-graphql"
import { authorization } from "/utils"


const options = {
  session: false,
  security: false,
}


const graphql = server.utils.modern(graphqlHTTP(req => {
  return {
    schema,
    graphiql: true,
  }
}))


server(
  options,
  authorization,
  server.router.post("/graphql", graphql),
  server.router.get("/graphql", graphql),
  ctx => 200,
).then(({ options }) => {
  console.log(`Karma.Red GraphQL server started on port ${ options.port }`)
})
