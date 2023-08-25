

export class AuthError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'AuthError'
  }
}