import * as THREE from 'three'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import PlanetMesh from '../planetMesh'

// shaders
import fragmentShader from '@ccpdata/shaders/gas/globe.frag.glsl?raw'
import vertexShader from '@ccpdata/shaders/gas/globe.vert.glsl?raw'

// ccp data
import planetSphere from '@ccpdata/models/planetSphere.json'

export default class GlobeGas extends PlanetMesh {

  constructor( planetUniforms: { [uniform: string]: UniformParameter } ) {

    // build geometry
    const geometryLoader = new THREE.BufferGeometryLoader()
    const geometry = geometryLoader.parse( planetSphere )

    
    // build material
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader })
    

    // build mesh
    super( geometry, material, 'transparentSphere' )


    // binding uniforms
    this.bindUniforms([

      // settings
      planetUniforms.heightMap1,
      planetUniforms.NoiseMap,
      planetUniforms.DistortionMap,
      planetUniforms.PolesMaskMap,
      
      // textures
      planetUniforms.WindFactors,
      planetUniforms.DistoFactors,
      planetUniforms.FuzzyEdges,
      planetUniforms.BandingSpeed,
      planetUniforms.Saturation,
      planetUniforms.ringColor1,
      planetUniforms.ringColor2,
      planetUniforms.ringColor3,
      planetUniforms.CapColor,
      planetUniforms.RingsFactors,
      planetUniforms.Alpha,

      // contants
      planetUniforms.time,
      planetUniforms.AmbientColor,
      planetUniforms.fogSettings

    ])

  }

}