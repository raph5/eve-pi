import { writable } from "svelte/store"
import installationsStorage from "./storage"
import type { Installation, Character } from "./factory"
import { initInstallation } from "./factory"

function createInstallationsStore() {

  const storageData = installationsStorage.getAll()

  const { subscribe, set, update } = writable<Record<string, Installation>>(storageData)

  async function init(name: string, characters: Character[]) {
    const installation = await initInstallation(name, characters)
    installationsStorage.set(installation)
    update(store => {
      store[installation.id] = installation
      return store
    })
    return installation.id
  }

  async function setName(installationId: string, name: string) {
    update(store => {
      store[installationId].name = name
      return store
    })
  }

  return { subscribe, init, setName }

}

const installations = createInstallationsStore()

export default installations