import * as THREE from "three";
import layer1VertShader from "./shaders/layer1/vert.glsl?raw";
import layer1FragShader from "./shaders/layer1/frag.glsl?raw";
import layer2VertShader from "./shaders/layer2/vert.glsl?raw";
import layer2SimpleFragShader from "./shaders/layer2/simple.frag.glsl?raw";
import layer2DoubleFragShader from "./shaders/layer2/double.frag.glsl?raw";
import layer2TirleFragShader from "./shaders/layer2/triple.frag.glsl?raw";
import { UniformParameterTransition } from "@utils/threejs/uniformParameter";

export interface PinOptions {
  primaryColor: THREE.Color
  secondaryColor: THREE.Color
  pinTexture: THREE.Texture
  rings: [number] | [number, number] | [number, number, number]
}

export default class Pin extends THREE.Group {

  private focusValue: UniformParameterTransition

  constructor(
    latitude: number,
    longitude: number,
    options: PinOptions
  ) {

    super()

    this.focusValue = new UniformParameterTransition('focus', 0)

    const layer1 = Pin.createLayer1(this.focusValue)
    this.add(layer1)

    const layer2 = Pin.createLayer2(this.focusValue, options)
    layer2.position.z = 0.1
    this.add(layer2)
    
    const axisX = new THREE.Vector3(1, 0, 0)
    const rotationY = new THREE.Quaternion().setFromAxisAngle( axisX, latitude - Math.PI/2 )
    const rotationYReverse = new THREE.Quaternion( rotationY.x, rotationY.y, rotationY.z, -rotationY.w )
    const axisZ = new THREE.Vector3(0, 1, 0).applyQuaternion(rotationYReverse)
    const rotationZ = new THREE.Quaternion().setFromAxisAngle( axisZ, longitude )
    this.quaternion.multiplyQuaternions(rotationY, rotationZ)
    this.position.setFromSphericalCoords(1.01, latitude, longitude)
    this.scale.setScalar(0.012)

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

  static createLayer2(focus: UniformParameterTransition, options: PinOptions) {

    let fragmentShader: string

    switch (options.rings.length) {
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
        rings: new THREE.Uniform( [0.9] ),
        pinTexture: new THREE.Uniform( options.pinTexture ),
        primaryColor: new THREE.Uniform( options.primaryColor ),
        secondaryColor: new THREE.Uniform( options.secondaryColor )
      },

      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor
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