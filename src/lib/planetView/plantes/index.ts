import { time } from "../time"
import AtmosphereTemperate from "./atmosphereTemperate"
import PlanetTemperate from "./planetTemperate"


type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(scene: THREE.Scene, type = 'temperate') {
  
  // get planet constructor
  const PlanetConstructor = PlanetTemperate

  // build planet
  const planet = new PlanetConstructor( time )
  const atmosphere = new AtmosphereTemperate( time )

  // add planet to scene
  scene.add( planet.mesh, atmosphere.mesh )

}