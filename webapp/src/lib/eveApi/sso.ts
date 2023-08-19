import { deleteCookie, getCookie } from "@utils/utils"
import { BACKEND_SSO, BACKEND_API } from "@src/var"

interface Token {
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


const CLIENT_ID = '269a5ec170594bb58f694b8f799c9915'
const SCOPE = 'esi-planets.manage_planets.v1'

// create sso url
const params = new URLSearchParams({
  response_type: 'code',
  redirect_uri: BACKEND_SSO,
  client_id: CLIENT_ID,
  scope: SCOPE,
  state: 'state'
})

export const SSO_LOGIN_URL = 'https://login.eveonline.com/v2/oauth/authorize?' + params.toString()


const tokenTypeValid = (tokenData: unknown) => (
  typeof tokenData === 'object' && tokenData &&
  typeof tokenData['access_token'] === 'string' &&
  typeof tokenData['expires_in'] === 'number' &&
  tokenData['token_type'] === 'Bearer' &&
  typeof tokenData['refresh_token'] === 'string' &&
  typeof tokenData['decoded_access_token'] === 'object' && tokenData['decoded_access_token'] &&
  typeof tokenData['decoded_access_token']['scp'] === 'string' &&
  typeof tokenData['decoded_access_token']['jti'] === 'string' &&
  typeof tokenData['decoded_access_token']['kid'] === 'string' &&
  typeof tokenData['decoded_access_token']['sub'] === 'string' &&
  typeof tokenData['decoded_access_token']['azp'] === 'string' &&
  typeof tokenData['decoded_access_token']['tenant'] === 'string' &&
  typeof tokenData['decoded_access_token']['tier'] === 'string' &&
  typeof tokenData['decoded_access_token']['region'] === 'string' &&
  typeof tokenData['decoded_access_token']['aud'] === 'string' &&
  typeof tokenData['decoded_access_token']['name'] === 'string' &&
  typeof tokenData['decoded_access_token']['owner'] === 'string' &&
  typeof tokenData['decoded_access_token']['exp'] === 'number' &&
  typeof tokenData['decoded_access_token']['iat'] === 'number' &&
  typeof tokenData['decoded_access_token']['iss'] === 'string'
)
const tokenExpirationValid = (tokenData: Token) => (
  tokenData.decoded_access_token.exp - 10 > Date.now() / 1000
)


let token: Token

// the goal of this function is to get a valide SSO token as soon as possible
export async function getToken(): Promise<Token | null> {

  let _token: Token | null = null
  
  // first we try localStorage
  const tokenLocalStorage = JSON.parse( localStorage.getItem("tokenData") )
  const tokenLocalStorageType = tokenTypeValid(tokenLocalStorage)

  if( token ) {
    _token = token
  }
  else if( tokenLocalStorageType && tokenExpirationValid(tokenLocalStorage) ) {
    _token = tokenLocalStorage
  }
  else {
    const tokenCookie = JSON.parse( getCookie("tokenData") )
    const tokenCookieType = tokenTypeValid(tokenCookie)
    // then we try to get token from the cookieStore
  
    if( tokenCookieType && tokenExpirationValid(tokenCookie) ) {
      _token = tokenCookie
    }
    else if( tokenLocalStorageType ) {
      _token = await refreshToken(tokenLocalStorage.refresh_token)
      
      if( !_token && tokenCookieType ) {
        _token = await refreshToken(tokenCookie.refresh_token)
      }
    }
    else {
      throw new Error("can't find valid SSO token")
    }
  }

  token = _token
  localStorage.setItem("tokenData", JSON.stringify(_token))

  return _token

}


// remove delete token from memory
export function deleteToken() {
  
  token = null
  localStorage.removeItem("tokenData")
  deleteCookie("tokenData")

}


// revoking refresh_token
// https://docs.esi.evetech.net/docs/sso/revoking_refresh_tokens.html
export async function revokToken(refreshToken) {

  const rep = await fetch(BACKEND_API + '/token/revok?token=' + refreshToken)
    .then(r => r.json())
    .catch(() => ({ 'error': 'error' }));
  
  if( rep['error'] ) throw new Error("error while revoking token")

}


// refreshing refresh_token
// https://docs.esi.evetech.net/docs/sso/refreshing_access_tokens.html
async function refreshToken(refreshToken: string): Promise<Token | null> {

  const rep = await fetch(BACKEND_API + '/token/refresh?token=' + refreshToken)
    .then(r => r.json())
    .catch(() => ({ 'error': 'error' }));
  
  if( rep['error'] || !tokenTypeValid(rep['data']) ) throw new Error("error while revoking token")

  return rep['data']

}


// logoff function that revok refresh_token and clear token from history
export async function logoff() {
  
  const token = await getToken().catch(() => null)

  if( !token ) throw new Error("can't logof : you are not logedin")

  // clear localStorage
  localStorage.removeItem("tokenData")

  // clear cookies
  deleteCookie("tokenData")

  // revok refresh_token
  const rep = await fetch(BACKEND_API + '/token/revok?token=' + token)
    .then(r => r.json())
    .catch(() => ({ 'error': 'error' }));

  if( rep['error'] ) throw new Error("error while revoking token")

}