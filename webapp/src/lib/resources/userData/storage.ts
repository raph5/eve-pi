import { JsonStorage } from "@lib/storage";
import type { UserData } from "./factory";

const userDataStorageInterface = new JsonStorage<Record<string, UserData>>('userData')

function get(user: string): UserData | null {
  const users = userDataStorageInterface.read()
  if(!users[user]) return null
  return users[user]
}

function set(data: UserData) {
  const users = userDataStorageInterface.read()
  users[data.name] = data
  userDataStorageInterface.set(users)
}

const userDataStorage = { get, set }
export default userDataStorage