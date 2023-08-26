import { writable } from "svelte/store"
import { initPlanet, type PlanetSetup } from "./factory"
import planetsStorage from "./storage"
import type { PlanetData } from "../installations/esi"

function createPlanetsStore() {

  const storageData = planetsStorage.getAll()

  const { subscribe, set, update } = writable<Record<string, PlanetSetup>>(storageData)

  async function init(userName: string, userId: number, planetData: PlanetData) {
    const planet = await initPlanet(userName, userId, planetData)
    planetsStorage.set(planet)
    update(store => {
      store[planet.setup_id] = planet
      return store
    })
    return planet.setup_id
  }

  function setName(setupId: string, name: string) {
    update(store => {
      store[setupId].setup_name = name
      planetsStorage.set(store[setupId])
      return store
    })
  }

  return { subscribe, init, setName }

}

const planets = createPlanetsStore()

export default planets