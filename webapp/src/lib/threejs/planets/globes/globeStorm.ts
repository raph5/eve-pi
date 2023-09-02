import * as THREE from 'three'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import PlanetMesh from '../planetMesh'

// shaders
import fragmentShader from '@ccpdata/shaders/storm/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/storm/globe.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class GlobeStorm extends PlanetMesh {

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
      planetUniforms.PlanetColor,
      planetUniforms.MagmaFactors,
      planetUniforms.MagmaFactors2,
      planetUniforms.CloudsColor,
      planetUniforms.CloudsFactors,
      planetUniforms.LightningColor,
      planetUniforms.Lightningfactors,
      
      // textures
      planetUniforms.MaskMap,
      planetUniforms.GroundScattering1,
      planetUniforms.GroundScattering2,
      planetUniforms.CloudsTexture,
      planetUniforms.CloudCapTexture,
      planetUniforms.Lava3DNoiseMap,
      planetUniforms.LightningMap,

      // contants
      planetUniforms.time,
      planetUniforms.AmbientColor,
      planetUniforms.fogSettings,
      planetUniforms.s6sl

    ])

  }

}