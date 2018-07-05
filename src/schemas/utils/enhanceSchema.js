import _ from "lodash"
import { Kind } from "graphql"


const objectTypeResolvers = ["fetch", "isTypeOf"]

const enhanceObjectType = (type, enhancers) => {
  const fields = type.getFields()
  _.forEach(enhancers, (enhancer, name) => {
    if (objectTypeResolvers.includes(name))
      return type[name] = enhancer

    if (fields[name] === void 0)
      throw new Error(`Unknown field "${ name }" of object type "${ type }"`)

    fields[name].resolve = enhancer
  })
}


const interfaceTypeResolvers = ["fetch", "resolveType"]

const enhanceInterfaceType = (type, enhancers) => {
  const fields = type.getFields()
  _.forEach(enhancers, (enhancer, name) => {
    if (interfaceTypeResolvers.includes(name))
      return type[name] = enhancer

    if (fields[name] === void 0)
      throw new Error(`Unknown field "${ name }" of interface type "${ type }"`)

    fields[name].resolve = enhancer
  })
}


const enhanceSchema = (schema, enhancement) => {
  _.forEach(enhancement, (enhancers, name) => {
    const type = schema.getType(name)
    if (type === void 0)
      throw new Error(`Unknown schema type "${ name }"`)

    switch (type.astNode.kind) {
      case Kind.OBJECT_TYPE_DEFINITION:
        return enhanceObjectType(type, enhancers)
      case Kind.INTERFACE_TYPE_DEFINITION:
        return enhanceInterfaceType(type, enhancers)
      default:
        throw new Error(`Unsupported schema type definition "${ type.astNode.kind }"`)
    }
  })
}


export default enhanceSchema
