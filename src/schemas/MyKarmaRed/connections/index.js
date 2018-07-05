import loans from "./loans"
import { createDefinition, collectDefinitions } from "/schema/utils"


const definition = `
  scalar Cursor

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`


export default collectDefinitions(
  createDefinition(definition),
  loans,
)
