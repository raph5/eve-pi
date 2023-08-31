import * as THREE from "three"
import { UniformParameter } from "@utils/shaders/uniformParameter";
import type { timeUniform } from "../planetView/time";
import { createUniformTexture } from "@utils/shaders/uniformTexture";
import { buildResUrl } from "@utils/utils";
import type { Template } from "./types";

export default class Planet extends THREE.Group {

  public uniforms: { [uniform: string]: UniformParameter } = {}

  constructor(
    private time: timeUniform,
  ) {
    
    super()

    // create global unifroms
    this.uniforms.time = this.time
    this.uniforms.AmbientColor = new UniformParameter(
      'AmbientColor',
      new THREE.Vector3( 0.1647, 0.0941, 0.0627 )
    ),
    this.uniforms.fogFactors = new UniformParameter(
      'fogFactors',
      new THREE.Vector4( 0.5, 0, 0.04, 1 )
    ),
    this.uniforms.fogSettings = new UniformParameter(
      'fogSettings',
      new THREE.Vector4( 0, 1, 7, 1 )
    )
    this.uniforms.LightColor = new UniformParameter(
      'LightColor',
      new THREE.Vector4( 1, 1, 1, 1 )
    )

    
  }

  // create an uniform for each template setting
  bindSettings( settings: Template['settings'] ) {
    for(const i in settings) {
      const setting = settings[i]
      let value: THREE.Vector4
      if(Array.isArray(setting)) {
        value = new THREE.Vector4( ...setting )
      }
      else {
        value = new THREE.Vector4( setting, 0, 0, 0 )
      }
      this.uniforms[i] = new UniformParameter<THREE.Vector4>( i, value )
    }
  }
  
  // create an uniform for each template texture
  bindTextures( textures: Template['textures'] ) {
    for(const i in textures) {
      const texture = createUniformTexture(
        buildResUrl(textures[i].src),
        textures[i].repeat,
        textures[i].minFilter,
        textures[i].anisotropy
      )
      this.uniforms[i] = new UniformParameter<THREE.Texture>( i, texture )
    }
  }

}