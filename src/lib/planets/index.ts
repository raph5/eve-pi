import type { timeUniform } from "../planetView/time"
import PlanetBarren from "./barren"
import PlanetTemperate from "./temperate"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(type = 'temperate', scene: THREE.Scene, time: timeUniform) {
  
  return new PlanetBarren( scene, time )

}