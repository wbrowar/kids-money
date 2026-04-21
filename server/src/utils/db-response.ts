export class DbMessage {
  readonly message: string = 'Empty message'
  readonly success: boolean = true

  constructor(message: string) {
    this.message = message
  }
}
export class DbError extends Error {
  readonly error: string = "{ message: 'Unknown error' }"
  readonly success: boolean = false

  constructor(errorMessage: string) {
    super()

    this.error = errorMessage
  }
}
