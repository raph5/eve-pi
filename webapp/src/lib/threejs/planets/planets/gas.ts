import * as THREE from 'three'
import Planet from '../planet'
import planetTemplate from '@ccpdata/templates/gas/gas11.json'
import { createUniformTexture } from '@utils/threejs/uniformTexture'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import heightMap from '@ccpdata/textures/gasHeightMap1.png'
import GlobeGas from '../globes/globeGas'
import type Time from '@lib/threejs/time'


export default class PlanetStorm extends Planet {
  
  private globe: GlobeGas

  constructor(
    time: Time
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

    // add planet to scene
    this.add( this.globe )

  }

}