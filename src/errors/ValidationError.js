class ValidationError extends Error {
  constructor(validations) {
    super("Validation error")
    this.validations = [].concat(validations)
  }
}


export default ValidationError
