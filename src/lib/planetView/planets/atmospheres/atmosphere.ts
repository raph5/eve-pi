import * as THREE from 'three'
import { buildResUrl } from '../../../utils/utils'
import { UniformParameter } from '../../uniform/uniformParameter'
import { createUniformTexture } from '../../uniform/uniformTexture'
import type Planet from '../planet'

// shaders
import fragmentShader from '../../../../ccpdata/shaders/atmosphere.frag.glsl?raw'
import vertexShader from '../../../../ccpdata/shaders/atmosphere.vert.glsl?raw'
import getSunDirection from '../shaders/getSunDirection.glsl?raw'

// ccp data
import planetRing from '../../../../ccpdata/models/planetRing.json'
import planetTemplate from '../../../../ccpdata/templates/terrestrial.json'

export default class Atmosphere {

  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  public mesh: THREE.Mesh
  public uniforms: { [uniform: string]: UniformParameter } = {}

  constructor( planet: Planet ) {

    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    this.geometry = geometryLoader.parse( planetRing )

    
    // build material
    this.material = new THREE.ShaderMaterial({

      vertexShader: getSunDirection + vertexShader,
      fragmentShader: getSunDirection + fragmentShader,

      blending: THREE.CustomBlending, 
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,

    })


    // build planetSettings
    const constantsOrder = [
      'AtmosphereFactors',
      'LightColor',
      'ScatteringFactors',
      'WavelengthsMicroMeters'
    ]

    const atmosphereSettings = []
    for(const c of constantsOrder) {
      if(c === null) {
        atmosphereSettings.push( new THREE.Vector4( 0, 0, 0, 0 ) )
      }
      else {
        atmosphereSettings.push( new THREE.Vector4( ...planetTemplate.settings[c] ) )
      }
    }

    // create uniforms
    this.uniforms.planetSettings = new UniformParameter(
      'cb0',
      atmosphereSettings
    )
    this.uniforms.groundScattering1 = new UniformParameter(
      's0',
      createUniformTexture( buildResUrl(planetTemplate.textures.GroundScattering1), false, 'linear', 1 )
    )
    this.uniforms.groundScattering2 = new UniformParameter(
      's1',
      createUniformTexture( buildResUrl(planetTemplate.textures.GroundScattering2), false, 'linear', 1 )
    )
    this.uniforms.cloudsTexture = new UniformParameter(
      's2',
      createUniformTexture( buildResUrl(planetTemplate.textures.CloudsTexture), true )
    )
    this.uniforms.cloudsCapTexture = new UniformParameter(
      's3',
      createUniformTexture( buildResUrl(planetTemplate.textures.CloudCapTexture), false )
    )

    // binding uniforms
    for(const u in this.uniforms) {
      this.uniforms[u].bind( this.material )
    }
    planet.uniforms.time.bind( this.material )
    planet.uniforms.fogSettings.bind( this.material )
    planet.uniforms.AmbientColor.bind( this.material )


    // build mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material )
    this.mesh.frustumCulled = false

  }

}