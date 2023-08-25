import { randomId } from "@utils/utils";
import { esiFetch } from "./esi";
import schematics from "@ccpdata/schematics/schematics.json"
import types from "@ccpdata/types/types.json"

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

export interface Planet {
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

const SPACEPORTS_ID = 1030
const STORAGES_ID = 1029

async function fetchInstallationData(charactersList: Character[]): Promise<InstallationData> {
  const characters = charactersList.map(c => ({ character_name: c.name, character_id: c.id }))

  const planetsDataPromise = characters.map(async (c) => {
    const options = {
      auth: { user: c.character_name }
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

export function getExtractedCommoditys(planet: Planet): number[] {
  const commoditys = []
  for(const p of planet.planet_layout.pins) {
    if(p?.extractor_details?.product_type_id) {
      const commodity = p.extractor_details.product_type_id;
      if(!commoditys.includes(commodity)) {
        commoditys.push(commodity)
      }
    }
  }
  return commoditys
}
export function getPorcessedCommoditys(planet: Planet): number[] {
  const commoditys = []
  for(const p of planet.planet_layout.pins) {
    if(p?.schematic_id) {
      const commodity = schematics[p.schematic_id].output.typeID;
      if(!commoditys.includes(commodity)) {
        commoditys.push(commodity)
      }
    }
  }
  return commoditys
}
export function getStoredCommoditys(planet: Planet): number[] {
  const commoditys = []
  for(const p of planet.planet_layout.pins) {
    if(p?.contents) {
      for(const c of p?.contents) {
        if(!commoditys.includes(c.type_id)) {
          commoditys.push(c.type_id)
        }
      }
    }
  }
  return commoditys
}

export function getProgress(planet: Planet): number {
  // TODO:
  return 0.5
}
export function getStorage(planet: Planet): number {
  const storages = planet.planet_layout.pins.filter(planet => (
    types[planet.type_id].group_id == SPACEPORTS_ID ||
    types[planet.type_id].group_id == STORAGES_ID
  ))
  const storagesTotalFilling = storages.map(storage => ([
    storage.type_id,
    storage.contents.reduce((a,b) => a + b.amount * types[b.type_id].volume, 0)
  ]))
  const storagesFilling = storagesTotalFilling.map(([ id, content ]) => content / types[id].capacity)
  return Math.max(...storagesFilling)
}