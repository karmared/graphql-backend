import { createDefinition } from "/schema/utils"


const definition = `
  type Asset {
    code: ID!
    amount: Float!
  }
`


export default createDefinition(
  definition,
  {
    Asset: {
    }
  }
)
