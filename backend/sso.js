const formUrlEncoded = require('form-urlencoded')
const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')

class HTTPFetchError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`)
    this.response = response
  }
}

const ENDPOINT = "https://login.eveonline.com"

class SingleSignOn {
  #authorization
  #jwks
  constructor(clientId, secretKey, callbackUri, { endpoint, userAgent } = {}) {
    this.clientId = clientId
    this.callbackUri = callbackUri
    this.#authorization = Buffer.from(`${clientId}:${secretKey}`).toString(
      "base64"
    )

    this.endpoint = endpoint ?? ENDPOINT
    this.host = new URL(this.endpoint).hostname
    this.userAgent =
      userAgent ??
      `${name}@${version} - nodejs@${process.version} - ${homepage}`

    this.#jwks = jwks({
      jwksUri: `${this.endpoint}/oauth/jwks`,
      requestHeaders: {
        "User-Agent": this.userAgent
      }
    })
  }

  getRedirectUrl(state, scopes) {
    let scope = ""

    if (scopes) {
      if (Array.isArray(scopes)) {
        scope = scopes.join(" ")
      } else {
        scope = scopes
      }
    }

    const search = new URLSearchParams({
      response_type: "code",
      redirect_uri: this.callbackUri,
      client_id: this.clientId,
      scope,
      state
    })

    return `${this.endpoint}/v2/oauth/authorize?${search.toString()}`
  }

  async getAccessToken(code, isRefreshToken = false) {
    const payload = !isRefreshToken
      ? {
          grant_type: "authorization_code",
          code
        }
      : {
          grant_type: "refresh_token",
          refresh_token: code
        }

    const response = await fetch(`${this.endpoint}/v2/oauth/token`, {
      method: "POST",
      body: formUrlEncoded(payload),
      headers: {
        Host: this.host,
        Authorization: `Basic ${this.#authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent
      }
    })

    if (!response.ok) {
      throw new HTTPFetchError(response)
    }

    const data = await response.json()

    data.decoded_access_token = await new Promise((resolve, reject) => {
      try {
        jwt.verify(
          data.access_token,
          this.getKey.bind(this),
          {
            issuer: [this.endpoint, this.host],
            audience: "EVE Online"
          },
          (err, decoded) => {
            if (err) {
              console.log("Error in jwt.verify: ", err.message)
              reject(err)
            } else {
              resolve(decoded)
            }
          }
        )
      } catch (error) {
        reject(error)
      }
    })

    return data
  }

  getKey(header, callback) {
    try {
      this.#jwks.getSigningKey(header.kid, function(err, key) {
        try {
          const signingKey = key.getPublicKey()
          callback(null, signingKey)
        } catch (error) {
          callback(error)
        }
      })
    } catch (error) {
      callback(error)
    }
  }
}

module.exports = SingleSignOn