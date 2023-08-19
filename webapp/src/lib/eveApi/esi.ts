import { getToken } from "./sso"

export async function esiFetch(
  url: string,
  query: Record<string, string> = {},
  body: string | Record<string, any> | any[] = '',
  authentified: boolean = false,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  } = {},
) {

  const method = options.method ?? body ? 'POST' : 'GET'

  if(typeof body !== 'string') {
    try {
      body = JSON.stringify(body)
    } catch (e) {
      throw new TypeError('Failed to serialize body :\n' + e)
    }
  }

  const params = new URLSearchParams(query)

  const headers = new Headers()
  headers.set('User-Agent', 'discord: raph_5#0989')
  headers.set('Content-Type', 'application/json')
  if(authentified) headers.set('Authorization', 'Bearer ' + getToken())

  const rep = await fetch(url + '?' + params.toString(), { body, headers, method })
    .then(r => r.json())
    .catch(e => { throw new Error("Error while fetching esi :\n" + e) })

  return rep

}