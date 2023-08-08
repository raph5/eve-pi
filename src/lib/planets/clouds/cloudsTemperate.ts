import * as THREE from 'three'
import { buildResUrl } from '@utils/utils'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import { createUniformTexture } from '@utils/shaders/uniformTexture'
import type Planet from '../planet'

// shaders
import fragmentShader from '@ccpdata/shaders/temperate/clouds.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/temperate/clouds.vert.glsl?raw'
import getSunDirection from '../shaders/getSunDirection.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'
import planetTemplate from '@ccpdata/templates/temperate/temperate09.json'

export default class CloudsTemperate {

  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  public mesh: THREE.Mesh
  public uniforms: { [uniform: string]: UniformParameter } = {}

  constructor( planet: Planet ) {

    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    this.geometry = geometryLoader.parse( planetSphere )


    // build material
    this.material = new THREE.ShaderMaterial({

      vertexShader: getSunDirection + vertexShader,
      fragmentShader: fragmentShader,

      blending: THREE.CustomBlending, 
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,

    })


    // build planetSettings
    const constantsOrder = [
      null,
      'CloudsColor',
      'CloudsFactors'
    ]

    const cloudsSettings = []
    for(const c of constantsOrder) {
      if(c === null) {
        cloudsSettings.push( new THREE.Vector4( 0, 0, 0, 0 ) )
      }
      else {
        cloudsSettings.push( new THREE.Vector4( ...planetTemplate.settings[c] ) )
      }
    }


    // create uniforms
    this.uniforms.planetSettings = new UniformParameter(
      'cb7',
      cloudsSettings
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
    planet.uniforms.AmbientColor.bind( this.material )
    planet.uniforms.fogSettings.bind( this.material )


    // build mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material )
    this.mesh.frustumCulled = false

  }

}