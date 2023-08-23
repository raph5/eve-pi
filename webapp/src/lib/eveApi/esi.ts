import { sso } from "./sso"

const ESI_ROOT = "https://esi.evetech.net/latest"

export async function esiFetch(
  url: string,
  query?: Record<string, string>,
  body?: Record<string, any> | any[],
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    auth?: {
      user: string
    }
  } = {},
): Promise<any> {

  const method = options.method ?? body ? 'POST' : 'GET'
  const auth = options.auth ?? null

  let encodedBody: string
  if(body) {
    try {
      encodedBody = JSON.stringify(body)
    } catch (e) {
      throw new TypeError('Failed to serialize body :\n' + e)
    }
  }

  const params = new URLSearchParams(query ?? {})

  const headers = new Headers()
  headers.set('User-Agent', 'discord: raph_5#0989')
  headers.set('Content-Type', 'application/json')
  if(auth) {
    const token = await sso.getToken(auth.user) 
    headers.set('Authorization', 'Bearer ' + token.access_token)
  }

  const rep = await fetch(ESI_ROOT + url + '?' + params.toString(), { body: encodedBody, headers, method })
    .then(r => r.json())
    .catch(e => { throw new Error("Error while fetching esi :\n" + e) })

  if( rep['error'] ) throw new Error("ESI error : " + rep['error'])

  return rep

}