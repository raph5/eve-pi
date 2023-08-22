import { Storage } from "./storage";

const userStorageInterface = new Storage('user')

function set(user: string) {
  userStorageInterface.set(user)
}

function get(): string {
  return userStorageInterface.read()
}

function remove() {
  userStorageInterface.set('')
}

const userStorage = { set, get, remove }
export default userStorage