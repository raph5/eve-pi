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

export default { set, get, remove }