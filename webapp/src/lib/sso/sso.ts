import { deleteCookie, getCookie } from "@utils/utils"
import {  BACKEND_API, BACKEND_SSO } from "@src/var"
import tokenStorage from "@lib/sso/storage"
import { AuthError } from "@lib/errors"

const CLIENT_ID = '269a5ec170594bb58f694b8f799c9915'
const SCOPE = 'esi-planets.manage_planets.v1'

// create sso url
export function getSsoUrl(state: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: BACKEND_SSO,
    client_id: CLIENT_ID,
    scope: SCOPE,
    state
  })
  
  return 'https://login.eveonline.com/v2/oauth/authorize?' + params.toString()
}

export interface Token {
  access_token: string,
  expires_in: number,
  token_type: "Bearer",
  refresh_token: string,
  decoded_access_token: {
    scp: string  // in reality scp type is string | string[]
    jti: string,
    kid: string,
    sub: string,
    azp: string,
    tenant: string,
    tier: string,
    region: string,
    aud: string,
    name: string,
    owner: string,
    exp: number,
    iat: number,
    iss: string
  }
}

const validTokenType = (tokenData: unknown) => (
  typeof tokenData === 'object' && tokenData &&
  typeof tokenData['access_token'] === 'string' &&
  typeof tokenData['expires_in'] === 'number' &&
  tokenData['token_type'] === 'Bearer' &&
  typeof tokenData['refresh_token'] === 'string' &&
  typeof tokenData['decoded_access_token'] === 'object' && tokenData['decoded_access_token'] &&
  typeof tokenData['decoded_access_token']['name'] === 'string' &&
  typeof tokenData['decoded_access_token']['exp'] === 'number' &&
  typeof tokenData['decoded_access_token']['sub'] === 'string'
)



export function getUserId(token: Token) {
  return parseInt(token.decoded_access_token.sub.split(':')[2])
}

class SSO {

  private initPromise: Promise<void>
  tokens: Record<string, Token> = {}
  cookieToken: Token | null

  constructor() {
    this.initPromise = this.init()
  }

  async init() {
    const cookieTokenPromise = SSO.getCookieToken()
    
    const tokensStorageData: Record<string, Token> = tokenStorage.getAll()
    const tokensValid = Object.values(tokensStorageData).filter(t => validTokenType(t))
    const tokensPromises = tokensValid.map(t => {
      if(t.decoded_access_token.exp - 10 > Date.now() / 1000) {
        return t
      } else {
        return SSO.refreshToken(t.refresh_token).catch(() => null)
      }
    })
    const tokensRefresh = await Promise.all(tokensPromises)
    const tokens = tokensRefresh.filter(t => t)

    this.cookieToken = await cookieTokenPromise.catch(() => null)
    if(this.cookieToken) {
      console.log('cookieToken !', this.cookieToken)
      tokens.push(this.cookieToken)
      deleteCookie('tokenData')
    }

    for(const t of tokens) {
      this.tokens[t.decoded_access_token.name] = t
    }

    tokenStorage.setAll(this.tokens)
  }

  async getToken(tokenName: string): Promise<Token> {
    await this.initPromise
    const token = this.tokens[tokenName]
    
    if(!token) throw new AuthError()

    if(token.decoded_access_token.exp - 10 > Date.now() / 1000) {
      return token
    }

    const refreshedToken = await this.refreshToken(tokenName)
      .catch(e => { throw new AuthError() })
    
    return refreshedToken
  }
  
  async isReady() {
    await this.initPromise
  }

  async destroyToken(tokenName: string) {
    await this.initPromise
    await SSO.revokToken( this.tokens[tokenName].refresh_token )

    delete this.tokens[tokenName]
    tokenStorage.remove(tokenName)
  }

  async refreshToken(tokenName: string): Promise<Token> {
    console.log("SSO token refreshed")
    await this.initPromise
    const token = await SSO.refreshToken( this.tokens[tokenName].refresh_token )
    
    this.tokens[tokenName] = token
    tokenStorage.add(token)

    return token
  }

  static async getCookieToken() {
    const tokenCookie: Token = JSON.parse( getCookie('tokenData') )
    
    if( validTokenType(tokenCookie) ) {
      if(tokenCookie.decoded_access_token.exp - 10 > Date.now() / 1000) {
        return tokenCookie
      } else {
        const refreshedToken = await SSO.refreshToken(tokenCookie.refresh_token)
        if(!refreshedToken) {
          throw new Error("Can't refresh token from cookie")
        }
        return refreshedToken
      }
    }
    
    throw new Error("Can't find token cookie")
  }

  static async revokToken(refreshToken: string) {
    const rep = await fetch(BACKEND_API + '/token/revok?token=' + refreshToken)
      .then(r => r.json())
      .catch(() => ({ 'error': 'error' }));
    
    if( rep['error'] ) throw new Error("error while revoking token")
  }

  static async refreshToken(refreshToken: string): Promise<Token> {
    const rep = await fetch(BACKEND_API + '/token/refresh?token=' + refreshToken)
      .then(r => r.json())
      .catch(() => ({ 'error': 'error' }));
    
    if( rep['error'] || !validTokenType(rep['data']) ) throw new Error("error while revoking token")

    return rep['data']
  }

}

export const sso = new SSO()