import * as THREE from 'three'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import PlanetMesh from '../planetMesh'

// shaders
import fragmentShader from '@ccpdata/shaders/lava/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/lava/globe.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class GlobeLava extends PlanetMesh {

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
      planetUniforms.LavaColor1,
      planetUniforms.LavaColor2,
      planetUniforms.Low,
      planetUniforms.Mid,
      planetUniforms.High,
      planetUniforms.LavaSpecular,
      planetUniforms.Parameters1,
      planetUniforms.Parameters2,
      planetUniforms.AnimationFactors,
      
      // textures
      planetUniforms.PolesGradient,
      planetUniforms.FillTexture,
      planetUniforms.heightMap1,
      planetUniforms.heightMap2,
      planetUniforms.GroundScattering1,
      planetUniforms.GroundScattering2,
      planetUniforms.Lava3DNoiseMap,

      // contants
      planetUniforms.time,
      planetUniforms.AmbientColor,
      planetUniforms.fogSettings,
      planetUniforms.s7sl

    ])

  }

}