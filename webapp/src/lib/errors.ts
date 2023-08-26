import { FALLBACK_URL } from "@src/var"

export class AuthError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    const msg = message ?? "SSO authentification error"
    super(msg, options)
    this.name = 'AuthError'
  }
}

export class EsiError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    const msg = message ?? "ESI error"
    super(msg, options)
    this.name = 'EsiError'
  }
}