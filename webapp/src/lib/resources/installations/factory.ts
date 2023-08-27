import { randomId } from "@utils/utils"
import planets from "../planetsSetup/store"
import { fetchPlanetData } from "./esi"
import type { Character } from "../userData/factory"

export interface CharacterData extends Character {
  planets: string[]
}

export interface Installation {
  name: string
  id: string
  characters: {
    [name: string]: CharacterData
  }
}

export async function initInstallation(installationName: string, charactersList: Character[]): Promise<Installation> {

  const characters: Record<string, CharacterData> = {}
  for(const { name, id } of charactersList) {
    characters[name] = {
      name,
      id,
      planets: []
    }
    
    const planetData = await fetchPlanetData(name, id)

    for(const planet of planetData) {
      const planetSetupId = await planets.init(name, id, planet)
      characters[name].planets.push(planetSetupId)
    }
  }

  return {
    name: installationName,
    id: randomId(),
    characters
  }

}