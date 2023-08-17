import type { timeUniform } from "../planetView/time"
import PlanetBarren from "./planets/barren"
import PlanetTemperate from "./planets/temperate"
import PlanetOceanic from "./planets/oceanic"
import PlanetIce from "./planets/ice"
import PlanetLava from "./planets/lava"
import PlanetPlasma from "./planets/plasma"
import PlanetStorm from "./planets/storm"
import PlanetGas from "./planets/gas"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function createPlanet(type = 'temperate', scene: THREE.Scene, time: timeUniform) {
  
  return new PlanetGas( time )

}