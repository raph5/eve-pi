import Planet from './planet'
import Atmosphere from "./atmospheres/atmosphereTemperate"
import CloudsTemperate from "./clouds/cloudsTemperate"
import GlobeTemperate from "./globes/globeTemperate"
import type { timeUniform } from '../planetView/time'


export default class PlanetTemperate extends Planet {
  
  private globe: GlobeTemperate
  private clouds: CloudsTemperate
  private atmosphere: Atmosphere

  constructor(
    scene: THREE.Scene,
    time: timeUniform
  ) {

    super(scene, time)

    // build planet
    this.globe = new GlobeTemperate( this )
    this.clouds = new CloudsTemperate( this )
    this.atmosphere = new Atmosphere( this )

    // add planet to scene
    scene.add( this.globe.mesh, this.clouds.mesh, this.atmosphere.mesh )

  }

}