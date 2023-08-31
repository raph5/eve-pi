import * as THREE from 'three'

// TODO: handle keydown events
// TODO: handle zoom with finger
// TODO: smooth ball rotation whene using fingers
// TODO: smooth ball rotation


export default class OrbitControls {
  
  // settings
  public zoomSpeed = 1
  public dragSpeed = 1
  public minZoom = 1
  public maxZoom = 10
  public cameraFriction = 8
  public cameraPitch = 0.6
  
  // camera spherical position and speed
  public zoom = 1
  public polarAngle = Math.PI / 2
  public azimutAngle = 0
  public polarAngleSpeed = 0
  public azimutAngleSpeed = 0
  
  // drag handling variables
  private mousePos = new THREE.Vector2()
  private mouseDown = false
  private lastDrag = 0
  private lastUpdate = 0

  // predefined variables ready to use
  private _v1 = new THREE.Vector3()
  private _q1 = new THREE.Quaternion()
  private _q2 = new THREE.Quaternion()

  constructor(
    private camera: THREE.Camera,
    private canvas: HTMLCanvasElement
  ) {

    // setup event listeners
    canvas.addEventListener( 'mousedown', (e) => this.handleMouseDown(e) )
    canvas.addEventListener( 'mousemove', (e) => this.handleMouseMove(e) )
    canvas.addEventListener( 'mouseup', (e) => this.handleMouseUp(e) )
    canvas.addEventListener( 'mouseenter', (e) => this.handleMouseEnter(e) )
    canvas.addEventListener( 'touchstart', (e) => this.handleTouchStart(e) )
    canvas.addEventListener( 'touchmove', (e) => this.handleTouchMove(e) )
    canvas.addEventListener( 'touchend', (e) => this.handleTouchEnd(e) )
    canvas.addEventListener( 'wheel', (e) => this.handleWheel(e) )

  }

  update() {
    // update camera position and rotation
    // will be executed on each frames

    const now = performance.now()

    // update position if camera speed
    if(!this.mouseDown && (this.polarAngleSpeed !== 0 || this.azimutAngleSpeed !== 0)) {
      const dt = now - this.lastUpdate

      const speedSum = Math.abs(this.polarAngleSpeed) + Math.abs(this.azimutAngleSpeed)

      const polarAngleSign = Math.sign(this.polarAngleSpeed)
      const azimutAngleSign = Math.sign(this.azimutAngleSpeed)
      this.polarAngleSpeed -= (this.polarAngleSpeed / speedSum) * dt * 0.000001 * this.cameraFriction
      this.azimutAngleSpeed -= (this.azimutAngleSpeed / speedSum) * dt * 0.000001 * this.cameraFriction
      if(Math.sign(this.polarAngleSpeed) !== polarAngleSign) this.polarAngleSpeed = 0
      if(Math.sign(this.azimutAngleSpeed) !== azimutAngleSign) this.azimutAngleSpeed = 0

      this.setPolarAngle(this.polarAngle + this.polarAngleSpeed * dt)
      this.setAzimutAngle(this.azimutAngle + this.azimutAngleSpeed * dt)
    }

    // position
    this.camera.position.x = this.zoom * Math.sin(this.polarAngle) * Math.sin(this.azimutAngle)
    this.camera.position.y = this.zoom * Math.cos(this.polarAngle)
    this.camera.position.z = this.zoom * Math.sin(this.polarAngle) * Math.cos(this.azimutAngle)
    
    // rotation
    this._v1.set( 0, 1, 0 )
    this._q1.setFromAxisAngle( this._v1, this.azimutAngle )
    this._v1.set( this.camera.position.z, 0, -this.camera.position.x )
    this._v1.normalize()
    this._q2.setFromAxisAngle( this._v1, this.polarAngle - Math.PI/2 )
    this._q2.multiply( this._q1 )
    this.camera.rotation.setFromQuaternion( this._q2 )

    this.lastUpdate = now
  }

  // mouse dragging
  dragStart( x: number, y: number ) {
    this.mouseDown = true

    this.mousePos.x = x
    this.mousePos.y = y

    this.lastDrag = performance.now()
  }
  dragMove( x: number, y: number ) {
    const dx = (this.mousePos.x - x) * this.dragSpeed * 0.0003 * this.zoom ** 2
    const dy = (this.mousePos.y - y) * this.dragSpeed * 0.0003 * this.zoom ** 2
    this.setAzimutAngle( this.azimutAngle + dx )
    this.setPolarAngle( this.polarAngle + dy )
    
    this.mousePos.x = x
    this.mousePos.y = y
    
    const now = performance.now()
    const dt = now - this.lastDrag
    this.azimutAngleSpeed = (this.azimutAngleSpeed*2 + dx / dt * this.cameraPitch) / 3
    this.polarAngleSpeed = (this.polarAngleSpeed*2 + dy / dt * this.cameraPitch) / 3
    this.lastDrag = now
  }
  dragEnd( x: number, y: number ) {
    this.mouseDown = false
  }

  // mose zooming
  addZoom( deltaZoom: number ) {
    this.zoom += deltaZoom * this.zoomSpeed * 0.002
    if(this.zoom < this.minZoom) this.zoom = this.minZoom
    if(this.zoom > this.maxZoom) this.zoom = this.maxZoom
  }

  // canvas events handlers
  handleMouseDown( event: MouseEvent ) {
    if(event.buttons === 1) {
      this.dragStart( event.x, event.y )
    }
  }
  handleMouseMove( event: MouseEvent ) {
    if(this.mouseDown) {
      this.dragMove( event.x, event.y )
    }
  }
  handleMouseUp( event: MouseEvent ) {
    if(this.mouseDown && event.buttons !== 1) {
      this.dragEnd( event.x, event.y )
    }
  }
  handleMouseEnter( event: MouseEvent ) {
    if(this.mouseDown && event.buttons !== 1) {
      this.dragEnd( this.mousePos.x, this.mousePos.y )
    }
  }
  handleTouchStart( event: TouchEvent ) {
    if(this.mouseDown && event.touches.length > 1) {
      this.dragEnd( event.touches[0].clientX, event.touches[0].clientY )
    }
    else {
      this.dragStart( event.touches[0].clientX, event.touches[0].clientY )
    }
  }
  handleTouchMove( event: TouchEvent ) {
    if(this.mouseDown) {
      this.dragMove( event.touches[0].clientX, event.touches[0].clientY )
    }
  }
  handleTouchEnd( event: TouchEvent ) {
    if(this.mouseDown) {
      this.dragEnd( event.touches[0].clientX, event.touches[0].clientY )
    }
  }
  handleWheel( event: WheelEvent ) {
    this.addZoom( event.deltaY )
  }

  // utils
  setPolarAngle( angle: number ) {
    this.polarAngle = angle
    if(this.polarAngle < 0.001) this.polarAngle = 0.001
    if(this.polarAngle > Math.PI) this.polarAngle = Math.PI
  }
  setAzimutAngle( angle: number ) {
    this.azimutAngle = angle
  }

}