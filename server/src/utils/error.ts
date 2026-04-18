export class DbError extends Error {
  readonly error: string = "{ message: 'Unknown error' }"

  constructor(errorMessage: string) {
    super()

    this.error = errorMessage
  }
}
