import is from "is_js"


const errorExtensions = [
  "chain",
  "validations",
  "authorization",
]


export const formatError = error => {
  const extensions = errorExtensions.reduce((memo, name) => {
    if (
      is.existy(error.originalError) &&
      is.existy(error.originalError[name])
    )
      memo[name] = error.originalError[name]
    return memo
  }, {})

  return {
    ...error,
    extensions,
  }
}
