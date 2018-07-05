import is from "is_js"
import store from "/store"
import schema from "/graphql-schema"
import { phoneFetch } from "/transport"
import { normalizePhone } from "/utils"
import { ValidationError } from "/errors"


const definition = /* GraphQL */`
  input RequestPhoneConfirmationInput {
    phone: String!
  }

  type RequestPhoneConfirmationPayload {
    status: Boolean!
  }

  extend type Mutation {
    requestPhoneConfirmation(
      input: RequestPhoneConfirmationInput!
    ): RequestPhoneConfirmationPayload!
  }
`


const generateToken = (base = 6) => {
  const floor = Math.pow(10, base - 1)
  return Math.floor(Math.random() * floor * 9) + floor + ""
}


const expirePhoneConfirmationTokens = async (userId) => {
  const connection = await store.connect()

  await store.table("tokens")
    .filter(token => token("user")("id").eq(userId))
    .filter(token => token("kind").eq("phone-confirmation"))
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


const requestPhoneConfirmation = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const phone = normalizePhone(input.phone)
  if (is.not.existy(phone))
    throw new ValidationError({
      keyword: "format",
      dataPath: "/phone",
    })

  await expirePhoneConfirmationTokens(viewer.id)

  const token = generateToken()

  await phoneFetch({
    message: `Token: ${token}`,
    receiver: phone,
    immediate: true,
  })

  await store.node.create(
    "Token",
    {
      token,
      phone,
      kind: "phone-confirmation",
      user: {
        id: viewer.id,
      },
    }
  )

  return {
    status: true
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      requestPhoneConfirmation,
    }
  }
)
