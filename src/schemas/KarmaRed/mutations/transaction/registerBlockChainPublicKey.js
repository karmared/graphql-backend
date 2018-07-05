import schema from "/graphql-schema"
import { chainFetch } from "/transport"


const definition = /* GraphQL */`
  input RegisterBlockChainPublicKeyInput {
    publicKey: String!
  }

  type RegisterBlockChainPublicKeyPayload {
    walletIds: [ID!]!
  }

  extend type Mutation {
    registerBlockChainPublicKey(
      input: RegisterBlockChainPublicKeyInput!
    ): RegisterBlockChainPublicKeyPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "register_bitshares_wallet",
    data: {
      public_key: input.publicKey
    }
  }
}


const registerBlockChainPublicKey = async (root, { input }) => {
  const response = await chainFetch(payloadFromInput(input))

  return {
    walletIds: response.data.wallet_ids
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      registerBlockChainPublicKey
    }
  }
)
