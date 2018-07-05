import { chainFetch } from "/transport"
import { createDefinition } from "/schema/utils"


const definition = `
  type GenerateBlockChainKeyPairPayload {
    publicKey: String!
    privateKey: String!
  }

  extend type Mutation {
    generateBlockChainKeyPair: GenerateBlockChainKeyPairPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "generate_keys_pair"
  }
}


const generateBlockChainKeyPair = async (root) => {
  const response = await chainFetch(payloadFromInput())

  return {
    publicKey: response.data.public_key,
    privateKey: response.data.private_key,
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      generateBlockChainKeyPair
    }
  }
)
