import { sso } from "../sso/sso"
import userStorage from "@lib/user/storage"
import { AuthError } from "../errors"

export async function getUserName(): Promise<string> {
  
  let user = userStorage.get()

  // this code is at the wrong place
  // the code relating to soo internal logic need to be elsewhere
  // TODO: moove this piece code
  await sso.isReady()

  if(sso.cookieToken) {
    if(!user) {
      // on first login ther is no 'user' in userStorage
      user = sso.cookieToken.decoded_access_token.name
      userStorage.set(user)
      sso.cookieToken = null
    }
    else if(sso.cookieToken.decoded_access_token.name === user) {
      sso.cookieToken = null
    }
  }

  if(!user) throw new AuthError()
  
  // check if user is logged
  await sso.getToken(user)

  return user

}

export async function logOff() {

  const userName = userStorage.get()
  if(userName) {
    await sso.destroyToken(userName)
    userStorage.remove()
  }

}