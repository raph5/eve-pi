import { JsonStorage } from "@lib/storage";
import type { Installation } from "./factory";

const planetsStorageInterface = new JsonStorage<Record<string, Installation>>('installations')

function get(installationId: string): Installation | null {
  const planets = planetsStorageInterface.read()
  if(!planets[installationId]) return null
  return planets[installationId]
}

function set(installation: Installation) {
  const planets = planetsStorageInterface.read()
  planets[installation.id] = installation
  planetsStorageInterface.set(planets)
}

function getAll(): Record<string, Installation>  {
  return planetsStorageInterface.read()
}

const installationsStorage = { get, set, getAll }

export default installationsStorage