const definition = `
  interface Node {
    id: ID!
  }
`


const enhancement = {
  Node: {
    resolveType: ({ __type }) => __type
  }
}


export default {
  definition,
  enhancement,
}
