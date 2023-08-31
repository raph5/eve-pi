import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphere"
import GlobeBarren from "../globes/globeBarren"
import type { timeUniform } from '../../planetView/time'
import planetTemplate from '@ccpdata/templates/barren/barren26.json'
import { createUniformTexture } from '@utils/shaders/uniformTexture'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import heightMap from '@ccpdata/textures/heightMap2.png'


export default class PlanetBarren extends Planet {
  
  private globe: GlobeBarren
  private atmosphere: Atmosphere

  constructor(
    time: timeUniform
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
    this.globe = new GlobeBarren( this.uniforms )
    this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe, this.atmosphere )

  }

}