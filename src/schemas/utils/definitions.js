export const createDefinition = (definition, enhancement) => {
  return {
    definition,
    enhancement,
  }
}


export const collectDefinitions = (...entries) => {
  const definition = entries.map(({ definition }) => definition)
  const enhancement = entries.map(({ enhancement }) => enhancement)
  return {
    definition,
    enhancement,
  }
}
