import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphere"
import CloudsTemperate from "../clouds/cloudsTemperate"
import GlobeTemperate from "../globes/globeTemperate"
import planetTemplate from '@ccpdata/templates/temperate/temperate10.json'
import { createUniformTexture } from '@utils/threejs/uniformTexture'
import heightMap from '@ccpdata/textures/heightMap1.png'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import type Time from '@lib/threejs/time'


export default class PlanetTemperate extends Planet {
  
  private globe: GlobeTemperate
  private clouds: CloudsTemperate
  private atmosphere: Atmosphere

  constructor(
    time: Time
  ) {

    super(time)

    // bind settings and textures
    this.bindSettings( planetTemplate.settings )
    // @ts-ignore
    this.bindTextures( planetTemplate.textures )

    // import height map
    const heightMapTexture = createUniformTexture( heightMap, false, 'linear' )
    this.uniforms.heightMap1 = new UniformParameter( 'heightMap1', heightMapTexture )
    this.uniforms.heightMap2 = new UniformParameter( 'heightMap2', heightMapTexture )

    // build planet
    this.globe = new GlobeTemperate( this.uniforms )
    this.clouds = new CloudsTemperate( this.uniforms )
    this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe, this.clouds, this.atmosphere )

  }

}