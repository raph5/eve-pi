import * as THREE from 'three'
import PlanetMesh from '../planetMesh'
import { UniformParameter } from '@utils/shaders/uniformParameter'

// shaders
import fragmentShader from '@ccpdata/shaders/oceanic/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/oceanic/globe.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class GlobeOceanic extends PlanetMesh {

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
      planetUniforms.WaterColor,
      planetUniforms.shallowWaterColor,
      planetUniforms.CloudsColor,
      planetUniforms.CloudsFactors,
      
      // textures
      planetUniforms.PolesGradient,
      planetUniforms.heightMap,
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