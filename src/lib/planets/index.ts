import type { timeUniform } from "../planetView/time"
import PlanetTemperate from "./temperate"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(type = 'temperate', scene: THREE.Scene, time: timeUniform) {
  
  return new PlanetTemperate( scene, time )

}