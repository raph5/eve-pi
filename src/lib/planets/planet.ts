import * as THREE from "three"
import { UniformParameter } from "@utils/shaders/uniformParameter";
import type { timeUniform } from "../planetView/time";

export default class Planet {

  public uniforms: { [uniform: string]: UniformParameter } = {}

  constructor(
    private scene: THREE.Scene,
    private time: timeUniform
  ) {

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

  }

}