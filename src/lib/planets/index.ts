import type { timeUniform } from "../planetView/time"
import PlanetBarren from "./barren"
import PlanetTemperate from "./temperate"
import PlanetOceanic from "./oceanic"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(type = 'temperate', scene: THREE.Scene, time: timeUniform) {
  
  return new PlanetOceanic( scene, time )

}