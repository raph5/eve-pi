import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphereTemperate"
import type { timeUniform } from '../../planetView/time'
import planetTemplate from '@ccpdata/templates/plasma/plasma02.json'
import { createUniformTexture } from '@utils/shaders/uniformTexture'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import heightMap from '@ccpdata/textures/lavaHeightMap1.png'
import GlobePlasma from '../globes/globePlasma'


export default class PlanetPlasma extends Planet {
  
  private globe: GlobePlasma
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

    this.uniforms.s7sl = new UniformParameter( 's7sl', 8 )

    // build planet
    this.globe = new GlobePlasma( this.uniforms )
    // this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe )

  }

}