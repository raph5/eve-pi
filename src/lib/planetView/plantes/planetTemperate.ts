import * as THREE from 'three'
import { base64ToBuffer, buildResUrl } from '../../utils/utils'

import heightMap from '../../../ccpdata/textures/heightMap.png'
import fragmentShader from '../../../ccpdata/shaders/earthLike.frag.glsl?raw'
import vertexShader from '../../../ccpdata/shaders/earthLike.vert.glsl?raw'
import planetTemplate from '../../../ccpdata/templates/terrestrial.json'
import type { timeUniform } from '../time'
import { ShaderUniform } from '../shader/shaderParameter'
import { createShaderTexture } from '../shader/shaderTexture'
import planetSphere from '../../../ccpdata/models/planetSphere.json'

export default class PlanetTemperate {

  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  public mesh: THREE.Mesh
  public uniforms: { [uniform: string]: ShaderUniform } = {}

  constructor( time: timeUniform ) {


    // build material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    })


    // build planetSettings
    const constantsOrder = [
      'DetailFactors',
      'MiscFactors',
      null,
      'WaterColor',
      'shallowWaterColor',
      'SharpnessFactors',
      'FillTint',
      'VegetationTint',
      'EquatorTint',
      'mountainTint',
      'CityLightColor',
      'CoverageFactors',
      'CloudsFactors'
    ]
    const planetSettings = []
    for(const c of constantsOrder) {
      if(c === null) {
        planetSettings.push( new THREE.Vector4( 0, 0, 0, 0 ) )
      }
      else {
        planetSettings.push( new THREE.Vector4( ...planetTemplate.settings[c] ) )
      }
    }


    // create uniforms
    this.uniforms.time = time
    this.uniforms.planetSettings = new ShaderUniform(
      'cb7',
      planetSettings
    )
    this.uniforms.sunDirection = new ShaderUniform(
      'sunDirection',
      new THREE.Vector3( 1, 1, 1 )
    )
    this.uniforms.AmbientColor = new ShaderUniform(
      'AmbientColor',
      new THREE.Vector3( 0.1647, 0.0941, 0.0627 )
    )
    this.uniforms.fogFactors = new ShaderUniform(
      'fogFactors',
      new THREE.Vector4( 0.5, 0, 0.04, 1 )
    )
    this.uniforms.fogSettings = new ShaderUniform(
      'fogSettings',
      new THREE.Vector4( 0, 1, 7, 1 )
    )
    this.uniforms.polesGradient = new ShaderUniform(
      's1',
      createShaderTexture( buildResUrl(planetTemplate.textures.PolesGradient) )
    )
    this.uniforms.fillTexture = new ShaderUniform(
      's2',
      createShaderTexture( buildResUrl(planetTemplate.textures.FillTexture), true )
    )
    const heightMapTexture = createShaderTexture( heightMap, false, 'linear' )
    this.uniforms.heightMap1 = new ShaderUniform( 's3', heightMapTexture )
    this.uniforms.heightMap2 = new ShaderUniform( 's4', heightMapTexture )
    this.uniforms.groundScattering1 = new ShaderUniform(
      's5',
      createShaderTexture( buildResUrl(planetTemplate.textures.GroundScattering1), false, 'linear', 1 )
    )
    this.uniforms.groundScattering2 = new ShaderUniform(
      's6',
      createShaderTexture( buildResUrl(planetTemplate.textures.GroundScattering2), false, 'linear', 1 )
    )
    this.uniforms.cityLight = new ShaderUniform(
      's7',
      createShaderTexture( buildResUrl(planetTemplate.textures.CityLight) )
    )
    this.uniforms.cloudsTexture = new ShaderUniform(
      's8',
      createShaderTexture( buildResUrl(planetTemplate.textures.CloudsTexture), true )
    )
    this.uniforms.cityDistributionTexture = new ShaderUniform(
      's9',
      createShaderTexture( buildResUrl(planetTemplate.textures.CityDistributionTexture) )
    )
    this.uniforms.cityDistributionMask = new ShaderUniform(
      's10',
      createShaderTexture( buildResUrl(planetTemplate.textures.CityDistributionMask) )
    )

    // binding uniforms
    for(const u in this.uniforms) {
      this.uniforms[u].bind( this.material )
    }

    this.material.blending = THREE.CustomBlending; 
    this.material.blendEquation = THREE.AddEquation;
    this.material.blendSrc = THREE.SrcAlphaFactor;
    this.material.blendDst = THREE.OneMinusSrcAlphaFactor;


    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    this.geometry = geometryLoader.parse( planetSphere )


    // build mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material )
    this.mesh.frustumCulled = false


  }

}