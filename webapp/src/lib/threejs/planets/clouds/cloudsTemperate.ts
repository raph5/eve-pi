import * as THREE from 'three'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import PlanetMesh from '../planetMesh'

// shaders
import fragmentShader from '@ccpdata/shaders/temperate/clouds.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/temperate/clouds.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class CloudsTemperate extends PlanetMesh {

  constructor( planetUniforms: { [uniform: string]: UniformParameter } ) {

    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    const geometry = geometryLoader.parse( planetSphere )


    // build material
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader })


    // build mesh
    super( geometry, material, 'transparent' )


    // binding uniforms
    this.bindUniforms([

      // settings
      planetUniforms.CloudsColor,
      planetUniforms.CloudsFactors,
      
      // textures
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