import { getUserId, sso } from "./eveApi/sso"
import userStorage from "@lib/storage/user"
import userDataStorage from "./storage/userData"
import type { UserStorage } from "./storage/userData"
import { createInstallation } from "./eveApi/installation"
import { AuthError } from "./errors"

export interface UserData extends UserStorage {
  getImg: (size: number) => string
}

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

async function initUserData(userName: string): Promise<UserStorage> {
  const token = await sso.getToken(userName)
  const id = getUserId(token)
  const mainInstallation = createInstallation('Main Installation', [{ id, name: userName }])
  return {
    id,
    name: userName,
    installations: { [mainInstallation.id]: mainInstallation }
  }
}

export async function getUserData(userName: string): Promise<UserData> {
  
  let storageData = userDataStorage.get(userName)

  if(!storageData) {
    storageData = await initUserData(userName)
    userDataStorage.set(userName, storageData)
  }

  const userData: UserData = {
    ...storageData,
    getImg: (size: number) => `https://images.evetech.net/characters/${userData.id}/portrait?size=${size}`
  }

  return userData

}

export async function logOff() {

  userStorage.remove()
  await sso.destroyToken( await getUserName() )

}