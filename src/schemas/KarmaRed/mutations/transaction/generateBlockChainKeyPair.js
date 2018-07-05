import schema from "/graphql-schema"
import { chainFetch } from "/transport"


const definition = /* GraphQL */`
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


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      generateBlockChainKeyPair
    }
  }
)
