const definition = `
  type User implements Node {
    id: ID!
    name: String
  }
`


const enhancement = {
  User: {
  }
}


export default {
  definition,
  enhancement,
}
