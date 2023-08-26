import type { PlanetData } from "../installations/esi"
import { fetchPlanetPublicData, fetchPlanetLayout, type PlanetLayout } from "./esi"
import { randomId } from "@utils/utils"

export interface PlanetSetup extends PlanetData {
  character_id: number
  character_name: string
  setup_id: string
  setup_name: string
  layout: PlanetLayout
}


export async function initPlanet(userName: string, userId: number, planetData: PlanetData): Promise<PlanetSetup> {

  const planetLayout = await fetchPlanetLayout(userName, userId, planetData.planet_id)
  const planetPublicData = await fetchPlanetPublicData(planetData.planet_id)

  return {
    ...planetData,
    character_id: userId,
    character_name: userName,
    setup_name: planetPublicData.name,
    setup_id: randomId(),
    layout: planetLayout
  }

}