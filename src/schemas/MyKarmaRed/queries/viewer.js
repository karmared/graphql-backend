import { createDefinition } from "/schema/utils"


const definition = `
  extend type Query {
    viewer: User
  }
`


const viewer = (root, args, context) => {
  return context.viewer
}


export default createDefinition(
  definition, {
    Query: {
      viewer
    }
  }
)
