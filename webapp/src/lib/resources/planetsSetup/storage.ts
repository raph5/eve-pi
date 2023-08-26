import { JsonStorage } from "@lib/storage";
import type { PlanetSetup } from "./factory";

const planetsStorageInterface = new JsonStorage<Record<string, PlanetSetup>>('planets')

function get(setupId: string): PlanetSetup | null {
  const planets = planetsStorageInterface.read()
  if(!planets[setupId]) return null
  return planets[setupId]
}

function set(setup: PlanetSetup) {
  const planets = planetsStorageInterface.read()
  planets[setup.setup_id] = setup
  planetsStorageInterface.set(planets)
}

function getAll(): Record<string, PlanetSetup>  {
  return planetsStorageInterface.read()
}

const planetsStorage = { get, set, getAll }

export default planetsStorage