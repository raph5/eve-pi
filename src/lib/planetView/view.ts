import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Background from './background'
import { loadPlanet } from './planets'

export interface InitOptions {
  fov?: number
  near?: number
  far?: number
  width?: number
  height?: number
}

export default class View {

  private fov: number
  private near: number
  private far: number
  private width: number
  private height: number
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private controls: OrbitControls

  constructor(
    canvas: HTMLCanvasElement,
    options: InitOptions = {}
  ) {

    // setup options
    this.fov = options.fov ?? 45
    this.near = options.near ?? 0.1
    this.far = options.far ?? 1000
    this.width = options.width ?? 500
    this.height = options.height ?? 500

    // let's create the scene
    this.scene = new THREE.Scene()

    // now create a camera
    // comput the aspect ration : this.width / this.height
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.width / this.height,
      this.near,
      this.far
    )
    this.camera.position.set(0, 0, 5);

    // finally create the renderer
    this.renderer = new THREE.WebGLRenderer({ canvas })

    // setup pixel ratio and size
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(this.width, this.height)

    // add a camera control tool
    // TODO: replace default camera control tool by a custom camera control tool
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.zoomSpeed = 1

    // three js helpers
    // TODO: remove helpers
    const gridHelper = new THREE.GridHelper(500, 50)
    // this.scene.add( gridHelper )

    // setup background
    const bg = new Background()
    const backgroundTexture = bg.color
    this.scene.background = backgroundTexture

    // add default planet
    // TODO: moove this in a proper function
    loadPlanet( this.scene, 'temperate' )

    // init render loop
    const renderLoop = () => {
      requestAnimationFrame( renderLoop )

      // update orbit control prosition
      this.controls.update()
      // render a new frame
      this.render()
    }
    renderLoop()
    
  }

  render() {
    this.renderer.render( this.scene, this.camera )
  }

  setSize(width: number, height: number) {

    this.width = width
    this.height = height

    // change camera aspect ratio
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    // change canvas size
    this.renderer.setSize(width, height)

  }

}