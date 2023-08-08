import Planet from './planet'
import Atmosphere from "./atmospheres/atmosphereTemperate"
import GlobeOceanic from './globes/globeOceanic'
import type { timeUniform } from '../planetView/time'


export default class PlanetOceanic extends Planet {
  
  private globe: GlobeOceanic
  private atmosphere: Atmosphere

  constructor(
    scene: THREE.Scene,
    time: timeUniform
  ) {

    super(scene, time)

    // build planet
    this.globe = new GlobeOceanic( this )
    // this.atmosphere = new Atmosphere( this )

    // add planet to scene
    scene.add( this.globe.mesh )

  }

}