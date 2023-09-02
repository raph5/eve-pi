import * as THREE from 'three'
import { UniformParameter } from "@utils/threejs/uniformParameter";

// create a shared time uniform
export default class Time extends UniformParameter {

  private clock: THREE.Clock

  constructor() {
    super('time', 0)
    this.clock = new THREE.Clock()
  }

  update() {
    this.set( this.clock.getElapsedTime() )
  }

}