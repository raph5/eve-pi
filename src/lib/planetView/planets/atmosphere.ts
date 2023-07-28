import * as THREE from 'three'
import { base64ToBuffer, buildResUrl } from '../../utils/utils'

// temporary import
import fragmentShader from '../../../ccpdata/shaders/atmosphere.frag.glsl?raw'
import vertexShader from '../../../ccpdata/shaders/atmosphere.vert.glsl?raw'
import planetSphereIndexsB64 from '../../../ccpdata/models/planetRing/indexs.B64?raw'
import planetSphereVerticesB64 from '../../../ccpdata/models/planetRing/vertices.B64?raw'
import planetTemplate from '../../../ccpdata/templates/terrestrial.json'
import heightMap from '../../../ccpdata/textures/heightMap.png'
import type { timeUniform } from '../time'
import { ShaderUniform } from '../shader/shaderParameter'
import { createShaderTexture } from '../shader/shaderTexture'

export default class Atmosphere {

  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  public mesh: THREE.Mesh
  public uniforms: { [uniform: string]: ShaderUniform } = {}

  constructor( time: timeUniform ) {

    // prepare the buffer
    this.geometry = new THREE.BufferGeometry()


    // build the vetrecies from the ccpwgl buffer
    const indexs = Array.from(new Uint16Array( base64ToBuffer(planetSphereIndexsB64) ))
    this.geometry.setIndex(indexs)

    const vertices = new Float32Array( base64ToBuffer(planetSphereVerticesB64) )
    const attr0 = new Float32Array( vertices.length/17 * 3 )
    const attr2 = new Float32Array( vertices.length/17 * 4 )
    const attr3 = new Float32Array( vertices.length/17 * 4 )
    const attr4 = new Float32Array( vertices.length/17 * 4 )
    const attr1 = new Float32Array( vertices.length/17 * 2 )
    for(let i=0; i<vertices.length; i++) {
      const adv = Math.floor(i / 17)
      const index = i % 17
      switch(true) {
        case index < 3 :
          attr0[adv*3 + index] = vertices[i]
          break
        case index < 7 :
          attr2[adv*4 + index - 3] = vertices[i]
          break
        case index < 11 :
          attr3[adv*4 + index - 7] = vertices[i]
          break
        case index < 15 :
          attr4[adv*4 + index - 11] = vertices[i]
          break
        case index < 17 :
          attr1[adv*2 + index - 15] = vertices[i]
          break
      }
    }

    this.geometry.setAttribute( 'attr0', new THREE.BufferAttribute( attr0, 3 ) )
    this.geometry.setAttribute( 'attr2', new THREE.BufferAttribute( attr2, 4 ) )
    this.geometry.setAttribute( 'attr3', new THREE.BufferAttribute( attr3, 4 ) )
    this.geometry.setAttribute( 'attr4', new THREE.BufferAttribute( attr4, 4 ) )
    this.geometry.setAttribute( 'attr1', new THREE.BufferAttribute( attr1, 2 ) )



    // to build the material we need too things :
    // 1. the vertex and the fragment shader
    // 2. the input for this shaders
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    })


    // build planetSettings
    // const constantsOrder = [
    //   null,
    //   'CloudsColor',
    //   'CloudsFactors'
    // ]

    // const atmosphereSettings = []
    // for(const c of constantsOrder) {
    //   if(c === null) {
    //     atmosphereSettings.push( new THREE.Vector4( 0, 0, 0, 0 ) )
    //   }
    //   else {
    //     atmosphereSettings.push( new THREE.Vector4( ...planetTemplate.settings[c] ) )
    //   }
    // }

    // create uniforms
    this.uniforms.time = time
    this.uniforms.planetSettings = new ShaderUniform(
      'cb0',
      [
        new THREE.Vector4(1.0195, 0.0500, 299.7500, 0),
        new THREE.Vector4(1, 1, 1, 1),
        new THREE.Vector4(0.0050, 0.0020, 20, 0),
        new THREE.Vector4(0.5527, 0.5801, 0.6035, 1)
      ]
    )
    this.uniforms.sunDirection = new ShaderUniform(
      'sunDirection',
      new THREE.Vector3( -1, 0, 0)
    )
    this.uniforms.AmbientColor = new ShaderUniform(
      'AmbientColor',
      new THREE.Vector3( 0.1647, 0.0941, 0.0627 )
    )
    this.uniforms.fogSettings = new ShaderUniform(
      'fogSettings',
      new THREE.Vector4( 0, 1, 7, 1 )
    )
    this.uniforms.groundScattering1 = new ShaderUniform(
      's0',
      createShaderTexture( buildResUrl(planetTemplate.textures.GroundScattering1), false, 'linear', 1 )
    )
    this.uniforms.groundScattering2 = new ShaderUniform(
      's1',
      createShaderTexture( buildResUrl(planetTemplate.textures.GroundScattering2), false, 'linear', 1 )
    )
    this.uniforms.cloudsTexture = new ShaderUniform(
      's2',
      createShaderTexture( buildResUrl(planetTemplate.textures.CloudsTexture), true )
    )
    this.uniforms.cloudsCapTexture = new ShaderUniform(
      's3',
      createShaderTexture( buildResUrl(planetTemplate.textures.CloudCapTexture), false )
    )

    // binding uniforms
    for(const u in this.uniforms) {
      this.uniforms[u].bind( this.material )
    }

    this.material.blending = THREE.CustomBlending; 
    this.material.blendEquation = THREE.AddEquation;
    this.material.blendSrc = THREE.SrcAlphaFactor;
    this.material.blendDst = THREE.OneMinusSrcAlphaFactor;


    // build mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material )

    this.mesh.frustumCulled = false

  }

}