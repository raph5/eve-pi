import type { Pin as PinData } from "@lib/resources/planetsSetup/esi";
import type { timeUniform } from "../planetView/time";
import Pin from "./pin";


export function createPin(pinData: PinData, time: timeUniform): Pin {
  return new Pin( pinData, time )
}