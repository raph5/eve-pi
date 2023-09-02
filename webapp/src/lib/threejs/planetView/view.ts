import * as THREE from 'three'
import OrbitControls from './orbitControl'
import Background from './background'
import Time from '../time'

export interface InitOptions {
  fov?: number
  near?: number
  far?: number
  width?: number
  height?: number
}

export default class View {

  public alive = true

  public time: Time

  private fov: number
  private near: number
  private far: number
  private width: number
  private height: number
  public scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private controls: OrbitControls

  constructor(
    canvas: HTMLCanvasElement,
    options: InitOptions = {}
  ) {

    this.time = new Time()

    // setup options
    this.fov = options.fov ?? 70
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

    // finally create the renderer
    this.renderer = new THREE.WebGLRenderer({ canvas })

    // setup pixel ratio and size
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(this.width, this.height)

    // add a camera control tool
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.zoom = 2
    this.controls.zoomSpeed = 1
    this.controls.minZoom = 1.2
    this.controls.maxZoom = 3
    this.controls.dragSpeed = 2

    // setup background
    const bg = new Background()
    const backgroundTexture = bg.color
    this.scene.background = backgroundTexture

    // init render loop
    const renderLoop = () => {
      // if view is not alive, stop render loop
      if(!this.alive) return

      requestAnimationFrame( renderLoop )

      // update time and orbit control
      this.time.update()
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

  destroy() {
    this.alive = false
  }

}