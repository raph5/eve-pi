import * as THREE from "three";
import Pin, { type PinOptions } from "./pin";
import type { Pin as PinData } from "@lib/resources/planetsSetup/esi";

export default class Spaceport extends Pin {

  constructor(pinData: PinData) {
    
    const pinTexture = new THREE.TextureLoader().load('/assets/pins/spaceport.png')

    const pinOptions: PinOptions = {
      pinTexture,
      rings: [0.5],
      primaryColor: new THREE.Color(0x1dd8f7),
      secondaryColor: new THREE.Color(0x2b749d)
    }

    super(pinData.latitude, pinData.longitude, pinOptions)
    
  }
  
}