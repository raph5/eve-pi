import type { UniformParameter } from "@utils/shaders/uniformParameter";
import * as THREE from "three";

export default class PlanetMesh extends THREE.Mesh {

  constructor(
    public geometry: THREE.BufferGeometry,
    public material: THREE.ShaderMaterial,
    blendMode: 'transparent' | 'transparentSphere' | 'opaque'
  ) {

    super(geometry, material)
    
    this.frustumCulled = false

    if(blendMode === 'transparent') {
      material.blending = THREE.CustomBlending
      material.blendEquation = THREE.AddEquation
      material.blendSrc = THREE.OneFactor
      material.blendDst = THREE.OneFactor
    }
    else if(blendMode === 'transparentSphere') {
      material.blending = THREE.CustomBlending
      material.blendEquation = THREE.AddEquation
      material.blendSrc = THREE.SrcAlphaFactor
      // @ts-ignore
      material.blendDst = THREE.SrcAlphaSaturateFactor
    }

  
  }

  bindUniforms( selection: UniformParameter[] ) {
    for(const u of selection) {
      console.log(u)
      u.bind(this.material)
    }
  }
  
}