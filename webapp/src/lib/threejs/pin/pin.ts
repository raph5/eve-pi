import * as THREE from "three";
import type { timeUniform } from "../planetView/time";
import type { Pin as PinData } from "@lib/resources/planetsSetup/esi";
import layer1FragShader from "./shaders/layer1.frag.glsl?raw";
import layer1VertShader from "./shaders/layer1.vert.glsl?raw";
import layer2FragShader from "./shaders/layer2.frag.glsl?raw";
import layer2VertShader from "./shaders/layer2.vert.glsl?raw";

export default class Pin extends THREE.Group {

  constructor(
    pinData: PinData,
    private time: timeUniform
  ) {

    super()

    const pinTexture = new THREE.TextureLoader().load( Pin.getPinTexture(pinData.type_id) )

    const layer1 = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: layer1VertShader,
        fragmentShader: layer1FragShader,

        uniforms: {
          pinBg: new THREE.Uniform( new THREE.Color( 0x999999 ) )
        },
        
        blending: THREE.SubtractiveBlending
      })
    )
    this.add(layer1)

    const layer2 = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: layer2VertShader,
        fragmentShader: layer2FragShader,

        uniforms: {
          pinTexture: new THREE.Uniform( pinTexture ),
          ringColor: new THREE.Uniform( new THREE.Color( 0xff0000 ) )
        },

        blending: THREE.AdditiveBlending
      })
    )
    layer2.position.z = 0.05
    this.add(layer2)


    this.position.z = 1.01
    this.scale.setScalar(0.03)

  }

  static getPinTexture(pinType: number) {
    return '/assets/pins/spaceport.png'
  }

}