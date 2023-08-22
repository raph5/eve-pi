import type { Installation } from "@lib/eveApi/installation";
import { JsonStorage } from "./storage";

export interface UserStorage {
  name: string
  id: number
  installations: Record<string, Installation>
}

const userDataStorageInterface = new JsonStorage<Record<string, UserStorage>>('userData')

function get(user: string): UserStorage | null {
  const users = userDataStorageInterface.read()
  if(!users[user]) return null
  return users[user]
}

function set(user: string, data: UserStorage) {
  const users = userDataStorageInterface.read()
  users[user] = data
  userDataStorageInterface.set(users)
}

const userDataStorage = { get, set }
export default userDataStorage