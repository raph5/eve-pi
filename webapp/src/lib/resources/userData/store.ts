import { writable } from "svelte/store"
import userDataStorage from "./storage"
import { initUserData, type UserData } from "./factory"
import { getUserName } from "@lib/user/user"
import { getUserId, sso } from "@lib/sso/sso"
import notifications from "@lib/notifications"

async function createUserStore() {

  const userName = await getUserName()
  let userData = userDataStorage.get(userName)

  if(!userData) {
    userData = await initUserData(userName)
    userDataStorage.set(userData)
  }

  for(let i=0; i<userData.alts.length; i++) {
    try {
      await sso.getToken(userData.alts[i].name)
    }
    catch {
      userData.alts.splice(i, 1)
      userDataStorage.set(userData)
    }
  }
  
  if(sso.cookieToken) {
    userData.alts.push({
      id: getUserId(sso.cookieToken),
      name: sso.cookieToken.decoded_access_token.name
    })
    sso.cookieToken = null
    userDataStorage.set(userData)
    notifications.push(`New character : ${userData.alts.at(-1).name}`, 'info')
  }

  const { subscribe, set, update } = writable<UserData>(userData)

  async function removeAlt(altName: string) {
    await sso.destroyToken(altName)
    update(user => {
      user.alts = user.alts.filter(a => a.name !== altName)
      userDataStorage.set(user)
      return user
    })
  }

  return { subscribe, removeAlt }

}

const user = await createUserStore()

export default user