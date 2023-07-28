import Planet from './planet'
import Atmosphere from "./atmospheres/atmosphere"
import CloudsTemperate from "./clouds/cloudsTemperate"
import GlobeTemperate from "./globes/globeTemperate"


export default class PlanetTemperate extends Planet {

  constructor(
    scene: THREE.Scene,
  ) {

    super(scene)

    // build planet
    const globe = new GlobeTemperate( this )
    const clouds = new CloudsTemperate( this )
    const atmosphere = new Atmosphere( this )

    // add planet to scene
    scene.add( globe.mesh, clouds.mesh, atmosphere.mesh )

  }

}