import * as THREE from 'three'
import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphereTemperate"
import type { timeUniform } from '../../planetView/time'
import planetTemplate from '@ccpdata/templates/gas/gas48.json'
import { createUniformTexture } from '@utils/shaders/uniformTexture'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import heightMap from '@ccpdata/textures/gasHeightMap1.png'
import GlobeGas from '../globes/globeGas'


export default class PlanetStorm extends Planet {
  
  private globe: GlobeGas
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
    const heightMapTexture = createUniformTexture( heightMap, true, 'linear' )
    this.uniforms.heightMap1 = new UniformParameter( 'heightMap1', heightMapTexture )

    this.uniforms.Alpha = new UniformParameter( 'Alpha', new THREE.Vector4( 0, 0, 0, 0 ) )

    // build planet
    this.globe = new GlobeGas( this.uniforms )
    // this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe )

  }

}