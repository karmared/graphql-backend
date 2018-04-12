import { createDefinition } from "/schema/utils"


const definition = `
  extend type Query {
    viewer: User
  }
`


const viewer = () => {
  return null
}


export default createDefinition(
  definition, {
    Query: {
      viewer
    }
  }
)
