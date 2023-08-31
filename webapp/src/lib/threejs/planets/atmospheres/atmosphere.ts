import * as THREE from 'three'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import PlanetMesh from '../planetMesh'

// shaders
import fragmentShader from '@ccpdata/shaders/global/atmosphere.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/global/atmosphere.vert.glsl?raw'

// ccp data
import planetRing from '@ccpdata/models/planetRing.json'

export default class Atmosphere extends PlanetMesh {

  constructor( planetUniforms: { [uniform: string]: UniformParameter } ) {

    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    const geometry = geometryLoader.parse( planetRing )

    
    // build material
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader })


    // build mesh
    super( geometry, material, 'transparent' )


    // binding uniforms
    this.bindUniforms([

      // settings
      planetUniforms.AtmosphereFactors,
      planetUniforms.LightColor,
      planetUniforms.ScatteringFactors,
      planetUniforms.wavelengthsMicroMeters,

      // contants
      planetUniforms.time,
      planetUniforms.AmbientColor,
      planetUniforms.fogSettings

    ])
    
  }

}