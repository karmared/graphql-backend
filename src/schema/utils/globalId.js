import {
  base64,
  unbase64,
} from "/schema/utils"


export const fromGlobalId = (globalId) => {
  const unbasedGobalId = unbase64(globalId)
  const delimiterPosition = unbasedGobalId.indexOf(":")
  return {
    type: unbasedGobalId.slice(0, delimiterPosition),
    id: unbasedGobalId.slice(delimiterPosition + 1),
  }
}


export const toGlobalId = (type, id) => {
  return base64([type, id].join(":"))
}


export const globalIdField = (typeName, idFetcher) => (node, args, context, info) => {
  return toGlobalId(
    typeName || info.parentType.name,
    idFetcher ? idFetcher(node, context, info) : node.id
  )
}
