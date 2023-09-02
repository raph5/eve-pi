import * as THREE from 'three'
import type { UniformParameter } from "./uniformParameter"

export type timingFunction = (x: number) => number


export const linearTimingFunction = (x: number) => x


export class UniformTransition {

  private clock: THREE.Clock
  
  constructor(
    public startValue: number,
    public endValue: number,
    public duration: number,
    public timingFunction: timingFunction = linearTimingFunction
  ) {
    this.clock = new THREE.Clock()
    this.clock.start()
  }

  getAdvancement() {
    const _advancement = this.clock.getElapsedTime() / this.duration
    return _advancement < 1 ? _advancement : 1
  }
  
  getValue(advancement: number) {
    return this.startValue + (this.endValue - this.startValue) * this.timingFunction(advancement)
  }

}