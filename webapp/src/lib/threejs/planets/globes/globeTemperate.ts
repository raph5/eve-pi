import * as THREE from 'three'
import PlanetMesh from '../planetMesh'
import type { UniformParameter } from '@utils/threejs/uniformParameter'

// shaders
import fragmentShader from '@ccpdata/shaders/temperate/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/temperate/globe.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class GlobeTemperate extends PlanetMesh {

  constructor( planetUniforms: { [uniform: string]: UniformParameter } ) {

    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    const geometry = geometryLoader.parse( planetSphere )

    
    // build material
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader })


    // build mesh
    super( geometry, material, 'opaque' )


    // binding uniforms
    this.bindUniforms([

      // settings
      planetUniforms.DetailFactors,
      planetUniforms.MiscFactors,
      planetUniforms.WaterColor,
      planetUniforms.shallowWaterColor,
      planetUniforms.SharpnessFactors,
      planetUniforms.FillTint,
      planetUniforms.VegetationTint,
      planetUniforms.EquatorTint,
      planetUniforms.mountainTint,
      planetUniforms.CityLightColor,
      planetUniforms.CoverageFactors,
      planetUniforms.CloudsFactors,
      
      // textures
      planetUniforms.PolesGradient,
      planetUniforms.FillTexture,
      planetUniforms.heightMap1,
      planetUniforms.heightMap2,
      planetUniforms.GroundScattering1,
      planetUniforms.GroundScattering2,
      planetUniforms.CityLight,
      planetUniforms.CloudsTexture,
      planetUniforms.CityDistributionTexture,
      planetUniforms.CityDistributionMask,

      // contants
      planetUniforms.time,
      planetUniforms.AmbientColor,
      planetUniforms.fogSettings

    ])

  }

}