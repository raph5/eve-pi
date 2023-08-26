import { sso } from "../sso/sso"
import userStorage from "@lib/user/storage"
import { AuthError } from "../errors"

export async function getUserName(): Promise<string> {
  
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
  
  if(!user) throw new AuthError()

  return user

}

export async function logOff() {

  userStorage.remove()
  await sso.destroyToken( await getUserName() )

}