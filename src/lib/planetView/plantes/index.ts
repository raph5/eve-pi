import Planet from "./planet"



type planetType = 'temperate' | 'storm' | 'plasma' | 'oceanic' | 'lava' | 'ice' | 'gas' | 'barren'

export function loadPlanet(scene, type = 'temperate') {
  
  // get planet constructor
  const planetConstructor = Planet

  // build planet
  const planet = new planetConstructor()

  // add planet to scene
  scene.add( planet.mesh )

}