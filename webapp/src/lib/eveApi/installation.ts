import { randomId } from "@utils/utils";
import { esiFetch } from "./esi";
import { getUserId, sso } from "./sso";

interface Commodity {
  amount: number
  type_id: number
}

interface Head {
  head_id: number
  latitude: number
  longitude: number
}

interface Link {
  destination_pin_id: number
  link_level: number
  source_pin_id: number
}

interface Route {
  content_type_id: number
  destination_pin_id: number
  quantity: number
  route_id: number
  source_pin_id: number
  waypoints: number
}

interface Pin {
  latitude: number
  longitude: number
  pin_id: number
  type_id: number
  contents?: Commodity[]
  expiry_time?: string
  install_time?: string
  last_cycle_start?: string
  schematic_id?: number
  extractor_details?: {
    cycle_time: number
    head_radius: number
    heads: Head[]
    product_type_id: number
    qty_per_cycle: number
  }
  factory_details?: {
    schematic_id: number
  }
}

interface Planet {
  last_update: string
  num_pins: number
  owner_id: number
  planet_id: number
  planet_type: 'temperate' | 'barren' | 'oceanic' | 'ice' | 'gas' | 'lava' | 'storm' | 'plasma'
  solar_system_id: number
  upgrade_level: number
  planet_layout: {
    links: Link[]
    pins: Pin[]
    routes: Route[]
  }
}

interface PlanetsData {
  character_name: string
  character_id: number
  planets: Planet[]
}

export interface InstallationData {
  [user: string]: PlanetsData
}

interface Character {
  name: string
  id: number
}

export interface Installation {
  id: number,
  name: string,
  characters: Character[]
}

async function fetchInstallationData(charactersList: Character[]): Promise<InstallationData> {

  const characters = charactersList.map(c => ({ character_name: c.name, character_id: c.id }))

  const planetsDataPromise = characters.map(async (c) => {
    const options = {
      auth: { sso: sso, user: c.character_name }
    }
    const planets: any[] = await esiFetch( `/characters/${c.character_id}/planets/`, null, null, options )

    const planetsDataPromise = planets.map(async (p) => {
      const planetLayout: any = await esiFetch( `/characters/${c.character_id}/planets/${p.planet_id}/`, null, null, options )
      return { ...p, planet_layout: planetLayout }
    })

    const planetsData = await Promise.all(planetsDataPromise)

    return { ...c, planets: planetsData }
  })

  const _planetsData: PlanetsData[] = await Promise.all(planetsDataPromise)
  const planetsData: Record<string, PlanetsData> = {}

  for(const p of _planetsData) {
    planetsData[p.character_name] = p
  }

  return planetsData

}

export async function getInstallationData(charactersList: Character[]): Promise<InstallationData> {
  return await fetchInstallationData(charactersList)
}

export function createInstallation(name: string, characters: Character[]): Installation {
  return {
    id: randomId(),
    characters,
    name
  }
}