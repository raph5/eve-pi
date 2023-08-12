import type { UniformParameter } from "@utils/shaders/uniformParameter";
import * as THREE from "three";

export default class PlanetMesh extends THREE.Mesh {

  constructor(
    public geometry: THREE.BufferGeometry,
    public material: THREE.ShaderMaterial,
    blendMode: 'transparent' | 'opaque'
  ) {

    super(geometry, material)
    
    this.frustumCulled = false

    if(blendMode === 'transparent') {
      material.blending = THREE.CustomBlending
      material.blendEquation = THREE.AddEquation
      material.blendSrc = THREE.OneFactor
      material.blendDst = THREE.OneFactor
    }
  
  }

  bindUniforms( selection: UniformParameter[] ) {
    for(const u of selection) {
      u.bind(this.material)
    }
  }
  
}