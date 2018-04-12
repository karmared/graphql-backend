import _ from "lodash"
import objects from "./objects"
import queries from "./queries"
import mutations from "./mutations"
import interfaces from "./interfaces"
import { enhanceSchema } from "/schema/utils"
import {
  Kind,
  parse,
  extendSchema,
  buildASTSchema,
} from "graphql"


const document = parse(`
  type Query

  type Mutation

  schema {
    query: Query
    mutation: Mutation
  }

  ${
    _.flattenDeep([
      objects.definition,
      queries.definition,
      mutations.definition,
      interfaces.definition,
    ]).join("\n")
  }
`)


const ExtensionKinds = [
  Kind.ENUM_TYPE_EXTENSION,
  Kind.UNION_TYPE_EXTENSION,
  Kind.OBJECT_TYPE_EXTENSION,
  Kind.SCALAR_TYPE_EXTENSION,
  Kind.INTERFACE_TYPE_EXTENSION,
  Kind.INPUT_OBJECT_TYPE_EXTENSION,
]


const [typeExtensions, typeDefinitions] = _.partition(document.definitions,
  definition => {
    return ExtensionKinds.includes(definition.kind)
  }
)


const schema = extendSchema(
  buildASTSchema({ kind: Kind.DOCUMENT, definitions: typeDefinitions }),
  { kind: Kind.DOCUMENT, definitions: typeExtensions },
)


enhanceSchema(
  schema,
  _.merge({},
    ..._.flattenDeep([
      objects.enhancement,
      queries.enhancement,
      mutations.enhancement,
      interfaces.enhancement,
    ])
  )
)


export default schema
