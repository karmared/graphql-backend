class ChainError extends Error {
  constructor(error) {
    super("Chain error")
    this.chainError = error
  }
}


export default ChainError
