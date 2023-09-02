import * as THREE from "three";
import Pin from "./pin";
import type { Pin as PinData } from "@lib/resources/planetsSetup/esi";

export default class Spaceport extends Pin {

  constructor(pinData: PinData) {
    
    const pinTexture = new THREE.TextureLoader().load('/assets/pins/spaceport.png')

    super(pinData.latitude, pinData.longitude, pinTexture, 1)
    
  }
  
}