import { randomId } from "@utils/utils"
import planets from "../planetsSetup/store"
import { fetchPlanetData } from "./esi"
import type { Character } from "../userData/factory"

export interface Installation {
  name: string
  id: string
  planets: string[]
}

export async function initInstallation(installationName: string, charactersList: Character[]): Promise<Installation> {

  const planetList = []
  for(const char of charactersList) {
    const planetData = await fetchPlanetData(char.name, char.id)

    for(const planet of planetData) {
      const planetSetupId = await planets.init(char.name, char.id, planet)
      planetList.push(planetSetupId)
    }
  }

  return {
    name: installationName,
    id: randomId(),
    planets: planetList
  }

}