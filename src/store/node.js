import { graphql } from "/transport"


const query = `
  query q($name: String!, $id: ID!) {
    collection(name: $name) {
      get(id: $id) {
        attributes
      }
    }
  }
`


const createQuery = `
  query q($name: String!, $attributes: String!) {
    collection(name: $name) {
      create(attributes: $attributes)
    }
  }
`


const updateQuery = `
  query q($name: String!, $id: ID!, $attributes: String!) {
    collection(name: $name) {
      update(id: $id, attributes: $attributes)
    }
  }
`


const node = async (name, id) => {
  return graphql({
    query,
    variables: { id, name }
  })
    .then(data => data.collection.get.attributes)
    .then(attributes => JSON.parse(attributes))
    .then(({ _id, ...attributes }) => ({ id: _id, ...attributes }))
    .catch(error => null)
}


node.create = async (name, attributes) => {
  return graphql({
    query: createQuery,
    variables: {
      name,
      attributes: JSON.stringify(attributes)
    }
  })
}


node.update = async (name, id, attributes) => {
  return graphql({
    query: updateQuery,
    variables: {
      name,
      id,
      attributes: JSON.stringify(attributes)
    }
  })
}


export default node
