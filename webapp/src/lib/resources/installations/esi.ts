import { esiFetch } from "@lib/eveApi/esi"

export interface PlanetData {
  last_update: string
  num_pins: number
  owner_id: number
  planet_id: number
  planet_type: 'temperate' | 'barren' | 'oceanic' | 'ice' | 'gas' | 'lava' | 'storm' | 'plasma'
  solar_system_id: number
  upgrade_level: number
}

export async function fetchPlanetData(userName: string, userId: number): Promise<PlanetData[]> {
  
  const esiOptions = { auth: { user: userName } }
  return await esiFetch( `/characters/${userId}/planets/`, null, null, esiOptions )

}