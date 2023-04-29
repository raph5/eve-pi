
const OPTIONS = {
  textureQuality: 0,
  shaderQuality: 'hi',
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
  rotationSpeed: 2
}

export function initPlanet(canvas: HTMLCanvasElement, ccpwgl: any): void {

  if(!window['ccpwgl_int']) {
    throw new Error("no window.ccpwgl_int")
  }
  
  const ccpwgl_int = window['ccpwgl_int'] as any
  const mat4 = ccpwgl_int.math.mat4

  ccpwgl.initialize(canvas, OPTIONS)
  console.log(canvas.getAttribute('height'))

  const camera = ccpwgl.createCamera(canvas, CAMERA_OPTIONS, true)
  const scene = ccpwgl.createScene([1, 1, 1])

  // postprocessing desabled
  // ccpwgl.enablePostprocessing(true)

  const planet = scene.loadPlanet(
    11,
    'res:/dx9/model/WorldObject/Planet/Template/Thunder/P_Thunder_08.red',
    undefined,
    'res:/dx9/model/worldobject/planet/Terrestrial/Terrestrial01_H.dds.0.png',
    'res:/dx9/model/worldobject/planet/Terrestrial/Terrestrial02_H.dds.0.png'
  )

  planet.setTransform(mat4.fromValues(
    40000, 0, 0, 0,
    0, 40000, 0, 0,
    0, 0, 40000, 0,
    0, 0, 0, 0
  ))

}