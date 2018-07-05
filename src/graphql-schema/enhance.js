import _ from "lodash"

import {
  Kind,
  parse,
  extendSchema,
  buildASTSchema,
} from "graphql"


const ExtensionKinds = [
  Kind.ENUM_TYPE_EXTENSION,
  Kind.UNION_TYPE_EXTENSION,
  Kind.OBJECT_TYPE_EXTENSION,
  Kind.SCALAR_TYPE_EXTENSION,
  Kind.INTERFACE_TYPE_EXTENSION,
  Kind.INPUT_OBJECT_TYPE_EXTENSION,
]


const objectTypeResolvers = ["fetch", "isTypeOf"]

const enhanceObjectType = (type, resolvers) => {
  const fields = type.getFields()
  _.forEach(resolvers, (resolver, name) => {
    if (objectTypeResolvers.includes(name))
      return type[name] = resolver

    if (fields[name] === void 0)
      throw new Error(`Unknown field "${ name }" of object type "${ type }"`)

    fields[name].resolve = resolver
  })
}


const interfaceTypeResolvers = ["fetch", "resolveType"]

const enhanceInterfaceType = (type, resolvers) => {
  const fields = type.getFields()
  _.forEach(resolvers, (resolver, name) => {
    if (interfaceTypeResolvers.includes(name))
      return type[name] = resolver

    if (fields[name] === void 0)
      throw new Error(`Unknown field "${ name }" of interface type "${ type }"`)

    fields[name].resolve = resolver
  })
}


const enhanceSchema = (schema, resolvers) => {
  _.forEach(resolvers, (resolver, name) => {
    const type = schema.getType(name)
    if (type === void 0)
      throw new Error(`Unknown schema type "${ name }"`)

    switch (type.astNode.kind) {
      case Kind.OBJECT_TYPE_DEFINITION:
        return enhanceObjectType(type, resolver)
      case Kind.INTERFACE_TYPE_DEFINITION:
        return enhanceInterfaceType(type, resolver)
      default:
        throw new Error(`Unsupported schema type definition "${ type.astNode.kind }"`)
    }
  })
}


export default (definitions, resolvers) => {
  const document = parse(definitions.join("\n"))

  const [typeExtensions, typeDefinitions] = _.partition(document.definitions,
    definition => {
      return ExtensionKinds.includes(definition.kind)
    }
  )

  const schema = extendSchema(
    buildASTSchema({ kind: Kind.DOCUMENT, definitions: typeDefinitions }),
    { kind: Kind.DOCUMENT, definitions: typeExtensions },
  )

  enhanceSchema(schema, _.merge({}, ...resolvers))

  return schema
}
