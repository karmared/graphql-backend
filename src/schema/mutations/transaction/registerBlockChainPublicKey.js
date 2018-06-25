import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `
  input RegisterBlockChainPublicKeyInput {
    publicKey: String!
  }

  type RegisterBlockChainPublicKeyPayload {
    walletId: ID!
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
    walletId: response.data.wallet_id
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      registerBlockChainPublicKey
    }
  }
)
