import * as THREE from 'three'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import PlanetMesh from '../planetMesh'

// shaders
import fragmentShader from '@ccpdata/shaders/barren/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/barren/globe.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class GlobeBarren extends PlanetMesh {

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
      planetUniforms.SharpnessFactors,
      planetUniforms.FillTint,
      planetUniforms.VegetationTint,
      planetUniforms.EquatorTint,
      planetUniforms.mountainTint,
      planetUniforms.CoverageFactors,
      planetUniforms.CloudsColor,
      planetUniforms.CloudsFactors,
      
      // textures
      planetUniforms.PolesGradient,
      planetUniforms.FillTexture,
      planetUniforms.heightMap1,
      planetUniforms.heightMap2,
      planetUniforms.GroundScattering1,
      planetUniforms.GroundScattering2,
      planetUniforms.CloudsTexture,
      planetUniforms.CloudCapTexture,

      // contants
      planetUniforms.time,
      planetUniforms.AmbientColor,
      planetUniforms.fogSettings

    ])

  }

}