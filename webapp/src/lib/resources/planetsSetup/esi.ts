import { esiFetch } from "@lib/eveApi/esi";


export interface Commodity {
  amount: number
  type_id: number
}

export interface Head {
  head_id: number
  latitude: number
  longitude: number
}

export interface Link {
  destination_pin_id: number
  link_level: number
  source_pin_id: number
}

export interface Route {
  content_type_id: number
  destination_pin_id: number
  quantity: number
  route_id: number
  source_pin_id: number
  waypoints: number
}

export interface Pin {
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

export interface PlanetLayout {
  links: Link[]
  pins: Pin[]
  routes: Route[]
}

export interface PlanetPublicData {
  name: string
  planet_id: number
  position: {
    x: number
    y: number
    z: number
  }
  system_id: number
  type_id: number
}


export async function fetchPlanetLayout(userName: string, userId: number, planetId: number): Promise<PlanetLayout> {

  const esiOptions = { auth: { user: userName } }
  return await esiFetch( `/characters/${userId}/planets/${planetId}/`, null, null, esiOptions )

}

export async function fetchPlanetPublicData(planetId: number): Promise<PlanetPublicData> {

  return await esiFetch(`/universe/planets/${planetId}`)

}