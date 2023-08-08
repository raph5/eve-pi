import Planet from './planet'
import Atmosphere from "./atmospheres/atmosphereTemperate"
import CloudsTemperate from "./clouds/cloudsTemperate"
import GlobeBarren from "./globes/globeBarren"
import type { timeUniform } from '../planetView/time'


export default class PlanetBarren extends Planet {
  
  private globe: GlobeBarren
  private atmosphere: Atmosphere

  constructor(
    scene: THREE.Scene,
    time: timeUniform
  ) {

    super(scene, time)

    // build planet
    this.globe = new GlobeBarren( this )
    // this.atmosphere = new Atmosphere( this )

    // add planet to scene
    scene.add( this.globe.mesh )

  }

}