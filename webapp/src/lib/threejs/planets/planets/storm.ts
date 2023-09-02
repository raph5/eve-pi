import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphere"
import GlobeStorm from "../globes/globeStorm"
import planetTemplate from '@ccpdata/templates/storm/storm08.json'
import { createUniformTexture } from '@utils/threejs/uniformTexture'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import heightMap from '@ccpdata/textures/heightMap1.png'
import type Time from '../../time'


export default class PlanetStorm extends Planet {
  
  private globe: GlobeStorm
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

    this.uniforms.s6sl = new UniformParameter( 's6sl', 64 )

    // build planet
    this.globe = new GlobeStorm( this.uniforms )
    this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe, this.atmosphere )

  }

}