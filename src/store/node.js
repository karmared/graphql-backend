import r from "/store"
import shortid from "shortid"
import { fromGlobalId } from "/schema/utils"


const NodeTables = new Map([
  ["User", "users"],
  ["Token", "tokens"],
  ["IndividualProfile", "user_profiles"],
])


const get = async (type, id = null) => {
  if (id === null)
    ({ type, id } = fromGlobalId(type))

  if (!NodeTables.has(type))
    return null

  const connection = await r.connect()

  return r.table(NodeTables.get(type))
    .get(id)
    .run(connection)
    .then(result => {
      connection.close()

      if (result === null) return null

      return {
        ...result,
        __type: type,
      }
    })
}


const getByIndex = async (type, params, index) => {
  if (!NodeTables.has(type))
    return null

  const connection = await r.connect()

  return r.table(NodeTables.get(type))
    .getAll(params, { index })
    .nth(0)
    .run(connection)
    .then(result => {
      connection.close()

      if (result === null) return null

      return {
        ...result,
        __type: type,
      }
    })
}


const create = async (type, attributes) => {
  if (!NodeTables.has(type))
    throw new Error(`Unknown node type "${type}"`)

  const connection = await r.connect()
  const id = shortid.generate()

  return r.table(NodeTables.get(type))
    .insert({
      ...attributes,
      id,
      created_at: r.now(),
    })
    .run(connection)
    .then(result => {
      connection.close()
      return id
    })
}


const update = async (type, id, attributes) => {
  if (!NodeTables.has(type))
    throw new Error(`Unknown node type "${type}"`)

  const connection = await r.connect()

  r.table(NodeTables.get(type))
    .get(id)
    .update({
      ...attributes,
      updated_at: r.now()
    })
    .run(connection)
    .then(result => {
      connection.close()
      return id
    })
}


export default {
  get,
  getByIndex,
  create,
  update,
}
