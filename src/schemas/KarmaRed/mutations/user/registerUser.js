import store from "/store"
import mailer from "/mailer"
import schema from "/graphql-schema"
import { ValidationError } from "/errors"


const definition = /* GraphQL */`

  input RegisterUserInput {
    email: String!
  }

  type RegisterUserPayload {
    status: Boolean!
  }

  extend type Mutation {
    registerUser(input: RegisterUserInput!): RegisterUserPayload!
  }

`


const expireRegistrationTokens = async email => {
  const connection = await store.connect()

  await store.table("tokens")
    .filter(token => {
      return store.and(
        token("email").eq(email),
        token("kind").eq("registration")
      )
    })
    .filter(token => {
      return store.or(
        token("expired_at").default(null).eq(null),
        token("accepted_at").default(null).eq(null),
      )
    })
    .update({
      expired_at: store.now(),
      updated_at: store.now(),
    })
    .run(connection)
    .then(() => {
      connection.close()
    })
}


const registerUser = async (root, { input }) => {
  const email = input.email.trim().toLowerCase()

  const user = await store.node
    .getByIndex("User", email, "email")
    .catch(error => null)

  if (user !== null)
    throw new ValidationError([{
      keyword: "unique",
      dataPath: "/email",
    }])

  await expireRegistrationTokens(email)

  const tokenId = await store.node.create("Token", {
    kind: "registration",
    email: email,
  })

  console.log(`Created token with id: ${tokenId}`)
  const status = await mailer({
    kind: "registration",
    receiver: email,
    params: {
      code: tokenId,
    }
  }).then(({ status }) => status)

  return {
    status
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      registerUser
    }
  }
)
