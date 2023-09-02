import * as THREE from "three";
import layer1VertShader from "./shaders/layer1/vert.glsl?raw";
import layer1FragShader from "./shaders/layer1/frag.glsl?raw";
import layer2VertShader from "./shaders/layer2/vert.glsl?raw";
import layer2SimpleFragShader from "./shaders/layer2/simple.frag.glsl?raw";
import layer2DoubleFragShader from "./shaders/layer2/double.frag.glsl?raw";
import layer2TirleFragShader from "./shaders/layer2/triple.frag.glsl?raw";
import { UniformParameterTransition } from "@utils/threejs/uniformParameter";

export default class Pin extends THREE.Group {

  private focusValue: UniformParameterTransition

  constructor(
    latitude: number,
    longitude: number,
    pinTexture: THREE.Texture,
    rings: 1 | 2 | 3
  ) {

    super()

    this.focusValue = new UniformParameterTransition('focus', 0)

    const layer1 = Pin.createLayer1(this.focusValue)
    this.add(layer1)

    const layer2 = Pin.createLayer2(this.focusValue, pinTexture, rings)
    layer2.position.z = 0.1
    this.add(layer2)

    console.log(latitude)
    console.log(longitude)
    this.rotateX(latitude - Math.PI/2)
    this.rotateY(longitude)
    this.position.setFromSphericalCoords(1.01, latitude, longitude)
    this.scale.setScalar(0.04)

    layer1.onBeforeRender = () => {
      this.focusValue.update()
    }

  }

  focus() {
    if(this.focusValue.get() !== 1) {
      this.focusValue.transition(1, 0.3)
    }
  }

  blur() {
    if(this.focusValue.get() !== 0) {
      this.focusValue.transition(0, 0.3)
    }
  }

  static createLayer2(focus: UniformParameterTransition, pinTexture: THREE.Texture, rings: 1 | 2 | 3) {

    let fragmentShader: string

    switch (rings) {
      case 1:
        fragmentShader = layer2SimpleFragShader
        break
      case 2:
        fragmentShader = layer2DoubleFragShader
        break
      case 3:
        fragmentShader = layer2TirleFragShader
        break
    }
    
    const geometry = new THREE.PlaneGeometry(2, 2)

    const material = new THREE.ShaderMaterial({
      vertexShader: layer2VertShader,
      fragmentShader,

      uniforms: {
        pinTexture: new THREE.Uniform( pinTexture ),
        ringColor: new THREE.Uniform( new THREE.Color( 0xff0000 ) )
      },

      blending: THREE.AdditiveBlending
    })

    focus.bind(material)

    return new THREE.Mesh( geometry, material )

  }

  static createLayer1(focus: UniformParameterTransition, ) {

    const geometry = new THREE.PlaneGeometry(2, 2)

    const material = new THREE.ShaderMaterial({
      vertexShader: layer1VertShader,
      fragmentShader: layer1FragShader,

      uniforms: {
        pinBg: new THREE.Uniform(new THREE.Color(0x999999))
      },

      blending: THREE.SubtractiveBlending
    })

    focus.bind(material)

    return new THREE.Mesh( geometry, material )

  }

}