import * as THREE from 'three'
import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphere"
import GlobeIce from '../globes/globeIce'
import planetTemplate from '@ccpdata/templates/ice/ice04.json'
import { createUniformTexture } from '@utils/threejs/uniformTexture'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import heightMap from '@ccpdata/textures/heightMap3.png'
import type Time from '@lib/threejs/time'


export default class PlanetIce extends Planet {
  
  private globe: GlobeIce
  private atmosphere: Atmosphere

  constructor(
    time: Time
  ) {

    super(time)

    // bind settings and textures
    this.bindSettings( planetTemplate.settings )
    // @ts-ignore
    this.bindTextures( planetTemplate.textures )

    if( !this.uniforms.IceRampColorHigh ) {
      this.uniforms.IceRampColorHigh = new UniformParameter( 'IceRampColorHigh', new THREE.Vector4( 1, 1, 1, 1 ) )
    }
    if( !this.uniforms.IceRampColorMiddle ) {
      this.uniforms.IceRampColorMiddle = new UniformParameter( 'IceRampColorMiddle', new THREE.Vector4( 0.5, 0.5, 0.5, 0.5 ) )
    }
    if( !this.uniforms.IceRampColorLow ) {
      this.uniforms.IceRampColorLow = new UniformParameter( 'IceRampColorLow', new THREE.Vector4( 0, 0, 0, 0 ) )
    }

    // import height map
    const heightMapTexture = createUniformTexture( heightMap, false, 'linear' )
    this.uniforms.heightMap1 = new UniformParameter( 'heightMap1', heightMapTexture )
    this.uniforms.heightMap2 = new UniformParameter( 'heightMap2', heightMapTexture )

    // build planet
    this.globe = new GlobeIce( this.uniforms )
    this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe, this.atmosphere )

  }

}