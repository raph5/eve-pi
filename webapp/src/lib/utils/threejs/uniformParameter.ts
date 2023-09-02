import * as THREE from "three"
import { linearTimingFunction, UniformTransition, type timingFunction } from "./uniformTransition"

// in threejs, we can't easily update shader uniforms
// that class will handle it 
export class UniformParameter<T=any> {

  private bindedMaterials: THREE.ShaderMaterial[] = []

  constructor(
    public name: string,
    private value: T
  ) {}

  // attach uniform to material
  bind( material: THREE.ShaderMaterial ) {
    material.uniforms[this.name] = new THREE.Uniform( this.value )
    this.bindedMaterials.push(material)
  }

  get() {
    return this.value
  }

  set( newValue: T ) {
    this.value = newValue

    for(const mat of this.bindedMaterials) {
      mat.uniforms[this.name].value = this.value
    }
  }

}


export class UniformParameterTransition extends UniformParameter<number> {

  private ongoingTransition: UniformTransition | null

  constructor(
    name: string,
    value: number
  ) {
    super(name, value)
    this.ongoingTransition = null
  }

  transition(newValue: number, duration: number, timingFunction: timingFunction = linearTimingFunction) {
    this.ongoingTransition = new UniformTransition(this.get(), newValue, duration, timingFunction)
  }

  update() {
    if(this.ongoingTransition) {
      const advancement = this.ongoingTransition.getAdvancement()
      this.set( this.ongoingTransition.getValue(advancement) )

      // if transition is over remove it
      if(advancement === 1) this.ongoingTransition = null
    }
  }

}