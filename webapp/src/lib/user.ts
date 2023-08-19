import type SSO from "./eveApi/sso"
import userStorage from "@lib/storage/user"

export async function getUser(sso: SSO) {
  
  let user = userStorage.get()
  
  // on first login ther is no 'user' in userStorage
  if(!user) {
    await sso.isReady()
    if(sso.cookieToken) {
      user = sso.cookieToken.decoded_access_token.name
      userStorage.set(user)
      sso.cookieToken = null
    }
  }
  
  const token = await sso.getToken(user).catch((e: Error) => {
    if(e.message === "No token with this name") throw new Error("User not loged")
    else throw e
  })
  
  return token.decoded_access_token.name

}

export async function logOff(sso: SSO) {

  userStorage.remove()
  await sso.destroyToken( await getUser(sso) )

}