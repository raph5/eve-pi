import { time } from "../time"
import Atmosphere from "./atmosphere"
import CloudsTemperate from "./cloudsTemperate"
import PlanetTemperate from "./planetTemperate"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(scene: THREE.Scene, type = 'temperate') {
  
  // get planet constructor
  const PlanetConstructor = PlanetTemperate

  // build planet
  const planet = new PlanetConstructor( time )
  const clouds = new CloudsTemperate( time )
  const atmosphere = new Atmosphere( time )

  // add planet to scene
  scene.add( atmosphere.mesh )

}