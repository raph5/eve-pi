import PlanetBarren from "./planets/barren"
import PlanetTemperate from "./planets/temperate"
import PlanetOceanic from "./planets/oceanic"
import PlanetIce from "./planets/ice"
import PlanetLava from "./planets/lava"
import PlanetPlasma from "./planets/plasma"
import PlanetStorm from "./planets/storm"
import PlanetGas from "./planets/gas"
import type Time from "../time"

type planetClass = typeof PlanetBarren | typeof PlanetTemperate | typeof PlanetOceanic | typeof PlanetIce | typeof PlanetLava | typeof PlanetPlasma | typeof PlanetStorm | typeof PlanetGas
type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function createPlanet(type: planetType, time: Time): InstanceType<planetClass> {

  let PlanetClass: planetClass

  switch (type) {
    case 'barren':
      PlanetClass = PlanetBarren
      break
    case 'temperate':
      PlanetClass = PlanetTemperate
      break
    case 'oceanic':
      PlanetClass = PlanetOceanic
      break
    case 'ice':
      PlanetClass = PlanetIce
      break
    case 'lava':
      PlanetClass = PlanetLava
      break
    case 'plasma':
      PlanetClass = PlanetPlasma
      break
    case 'storm':
      PlanetClass = PlanetStorm
      break
    case 'gas':
      PlanetClass = PlanetGas
      break
  }

  return new PlanetClass( time )

}