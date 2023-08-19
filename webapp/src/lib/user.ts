import { deleteToken, getToken, revokToken } from "@lib/eveApi/sso";


export async function isLogedIn() {

  const token = getToken().catch(() => null)
  return token !== null

}

export async function logOff() {

  const token = await getToken()
    .catch(() => { throw new Error("Can't logOff : user in not loged") })

  deleteToken()
  revokToken(token.token_type)

}