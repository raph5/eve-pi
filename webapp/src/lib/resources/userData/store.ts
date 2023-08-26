import { writable } from "svelte/store"
import userDataStorage from "./storage"
import { initUserData, type UserData } from "./factory"
import { getUserName } from "@lib/user/user"

async function createUserStore() {
  
  const userName = await getUserName()
  let userData = userDataStorage.get(userName)

  if(!userData) {
    userData = await initUserData(userName)
    userDataStorage.set(userData)
  }

  const { subscribe, set, update } = writable<UserData>(userData)

  return { subscribe }

}

const user = await createUserStore()

export default user