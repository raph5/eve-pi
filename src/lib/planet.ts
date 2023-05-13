import { createCamera } from "./camera"

const OPTIONS = {
  textureQuality: 0,
  shaderQuality: 'lo',
  anisotropicFilter: false,
  glParams: {},
  postprocessing: false
}

const CAMERA_OPTIONS = {
  fov: 30,
  distance: 180000,
  maxDistance: 250000,
  minDistance: 58000,
  rotationX: 0,
  rotationY: 0,
  poi: [0, 0, 0],
  nearPlane: 1,
  farPlane: 1000000,
  minPitch: -0.5,
  maxPitch: 0.35,
  rotationSensitivity: 2
}

export function initPlanet(canvas: HTMLCanvasElement, ccpwgl: any): void {

  if(!window['ccpwgl_int']) {
    throw new Error("no window.ccpwgl_int")
  }
  
  const ccpwgl_int = window['ccpwgl_int'] as any
  const mat4 = ccpwgl_int.math.mat4

  ccpwgl.initialize(canvas, OPTIONS)

  const camera = createCamera(canvas, CAMERA_OPTIONS, true, ccpwgl_int, ccpwgl)
  const scene = ccpwgl.loadScene('res:/dx9/scene/universe/m10_cube.red')
  // const scene = ccpwgl.createScene([1, 1, 1])

  // const obj = scene.loadObject('res:/dx9/model/structure/planetary/hostile/command/commh_t1/commh_t1.red')
  const obj = scene.loadObject('res:/dx9/model/ui/hextile.red')

  // const planet = scene.loadPlanet(
  //   11,
  //   'res:/dx9/model/WorldObject/Planet/Template/Thunder/P_Thunder_08.red',
  //   undefined,
  //   'res:/dx9/model/worldobject/planet/Terrestrial/Terrestrial01_H.dds.0.png',
  //   'res:/dx9/model/worldobject/planet/Terrestrial/Terrestrial02_H.dds.0.png'
  // )

  // console.log(planet)

  obj.setTransform(mat4.fromValues(
    10000, 0, 0, 0,
    0, 10000, 0, 0,
    0, 0, 10000, 0,
    0, 0, 0, 0
  ))
  // planet.setTransform(mat4.fromValues(
  //   40000, 0, 0, 0,
  //   0, 40000, 0, 0,
  //   0, 0, 40000, 0,
  //   0, 0, 0, 0
  // ))

  // // setup a performance shaderQuality switcher
  // let timerStart, timerEnd
  // let avgDt = 0
  // let i = -30

  // ccpwgl.onPreRender = () => {

  //   i++

  //   if(i < -1) return

  //   if(timerStart) {
  //     timerEnd = performance.now()
  //     avgDt = ( (timerEnd - timerStart) + avgDt*i ) / (i+1)
  //   }

  //   timerStart = performance.now()

  //   if(i > 20) {
  //     ccpwgl.onPreRender = null
      
  //     if(avgDt > 30) {
  //       ccpwgl_int.device.shaderModel = ccpwgl.ShaderQuality.LOW
  //       planet.wrappedObjects[0].effectHeight.Initialize()

  //       console.log(scene)

  //       console.log("shader quality switched to low")
  //     }
  //   }

  // }

}

// function change