import PlanetTemperate from "./temperate"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(scene: THREE.Scene, type = 'temperate') {
  
  return new PlanetTemperate( scene )

}