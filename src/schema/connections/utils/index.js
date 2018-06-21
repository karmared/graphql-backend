import is from "is_js"


const cursorToOffset = (ids, cursor, defaultValue) => {
  const offset = ids.indexOf(cursor)
  return offset === -1 ? defaultValue : offset
}


export const connectionFromIdsArray = (ids, { first, after, before, last }) => {
  const count = ids.length
  
  let afterIndex = is.existy(after) ? cursorToOffset(ids, after, 0) + 1 : 0
  let beforeIndex = is.existy(before) ? cursorToOffset(ids, before, count) : count

  if (is.number(first) && first < beforeIndex - afterIndex)
    beforeIndex = afterIndex + first

  if (is.number(last) && last < beforeIndex - afterIndex)
    afterIndex = beforeIndex - last

  ids = ids.slice(afterIndex, beforeIndex)

  return {
    count,
    pageInfo: {
      hasNextPage: beforeIndex !== count,
      hasPreviousPage: afterIndex !== 0,
    },
    edges: ids.map(id => ({ id }))
  }
}
