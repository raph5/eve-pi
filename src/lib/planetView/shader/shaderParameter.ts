

// in threejs, we can't easily update shader uniforms
// that class will handle it 
export class ShaderUniform<T=any> {

  private bindedMaterials: THREE.ShaderMaterial[] = []

  constructor(
    public name:string,
    private value:T
  ) {}

  // attach uniform to material
  bind( material: THREE.ShaderMaterial ) {
    material.uniforms[this.name] = { value: this.value }
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