import * as THREE from 'three'
import { buildResUrl } from '@utils/utils'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import { createUniformTexture } from '@utils/shaders/uniformTexture'
import type Planet from '../planet'

// shaders
import fragmentShader from '@ccpdata/shaders/temperate/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/temperate/globe.vert.glsl?raw'
import getSunDirection from '../shaders/getSunDirection.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'
import planetTemplate from '@ccpdata/templates/temperate/temperate09.json'
import heightMap from '@ccpdata/textures/heightMap1.png'

export default class GlobeTemperate {

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

    })


    // build globeSettings
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

    const globeSettings = []
    for(const c of constantsOrder) {
      if(c === null) {
        globeSettings.push( new THREE.Vector4( 0, 0, 0, 0 ) )
      }
      else {
        globeSettings.push( new THREE.Vector4( ...planetTemplate.settings[c] ) )
      }
    }


    // create uniforms
    this.uniforms.globeSettings = new UniformParameter(
      'cb7',
      globeSettings
    )
    this.uniforms.polesGradient = new UniformParameter(
      's1',
      createUniformTexture( buildResUrl(planetTemplate.textures.PolesGradient), true )
    )
    this.uniforms.fillTexture = new UniformParameter(
      's2',
      createUniformTexture( buildResUrl(planetTemplate.textures.FillTexture), true )
    )
    const heightMapTexture = createUniformTexture( heightMap, false, 'linear' )
    this.uniforms.heightMap1 = new UniformParameter( 's3', heightMapTexture )
    this.uniforms.heightMap2 = new UniformParameter( 's4', heightMapTexture )
    this.uniforms.groundScattering1 = new UniformParameter(
      's5',
      createUniformTexture( buildResUrl(planetTemplate.textures.GroundScattering1), false, 'linear', 1 )
    )
    this.uniforms.groundScattering2 = new UniformParameter(
      's6',
      createUniformTexture( buildResUrl(planetTemplate.textures.GroundScattering2), false, 'linear', 1 )
    )
    this.uniforms.cityLight = new UniformParameter(
      's7',
      createUniformTexture( buildResUrl(planetTemplate.textures.CityLight) )
    )
    this.uniforms.cloudsTexture = new UniformParameter(
      's8',
      createUniformTexture( buildResUrl(planetTemplate.textures.CloudsTexture), true )
    )
    this.uniforms.cityDistributionTexture = new UniformParameter(
      's9',
      createUniformTexture( buildResUrl(planetTemplate.textures.CityDistributionTexture) )
    )
    this.uniforms.cityDistributionMask = new UniformParameter(
      's10',
      createUniformTexture( buildResUrl(planetTemplate.textures.CityDistributionMask) )
    )

    // binding uniforms
    for(const u in this.uniforms) {
      this.uniforms[u].bind( this.material )
    }
    planet.uniforms.time.bind( this.material )
    planet.uniforms.fogFactors.bind( this.material )
    planet.uniforms.fogSettings.bind( this.material )
    planet.uniforms.AmbientColor.bind( this.material )


    // build mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material )
    this.mesh.frustumCulled = false

  }

}