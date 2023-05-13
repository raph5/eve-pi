
// A custom perspective Camera for eve-pi
export class Camera {

  distance = 1
  minDistance = -1
  maxDistance = 1000000
  fov = 60
  rotationX = 0
  rotationY = 0
  poi:[number, number, number]
  nearPlane = 1
  farPlane = 0
  rotationSensitivity = 1

  onShift = null
  shift = 0
  shiftStage = 0
  _shiftX = null

  _dragX = 0
  _dragY = 0
  _lastRotationX = 0
  _lastRotationY = 0
  _rotationSpeedX = 0
  _rotationSpeedY = 0
  _measureRotation = null
  _moveEvent = null
  _upEvent = null
  _prevScale = null

  additionalRotationX = 0
  additionalRotationY = 0

  vec3: any
  mat4: any
  ccpwgl_int: any

  constructor(canvas: HTMLCanvasElement, ccpwgl_int: any) {

    this.ccpwgl_int = ccpwgl_int
    this.vec3 = ccpwgl_int.math.vec3
    this.mat4 = ccpwgl_int.math.mat4

    this.poi = this.vec3.create()

    canvas.addEventListener('mousedown', (e) => this._DragStart(e), false)
    canvas.addEventListener('touchstart', (e) => this._DragStart(e), true)
    window.addEventListener('DOMMouseScroll', (e) => this._WheelHandler(e, canvas), false)
    window.addEventListener('mousewheel', (e) => this._WheelHandler(e, canvas), false)
  }

  // Sets the cameras poi to an object, and adjusts the distance to suit
  focus(obj: any, distanceMultiplier: number, minDistance: number): boolean {
    try {
      this.mat4.getTranslation(this.poi, obj.getTransform())
      this.distance = Math.max(obj.getBoundingSphere()[1] * (distanceMultiplier || 1), (minDistance || 0))
      console.log(this.distance)
      return true
    }
    catch (err) {
      return false
    }
  }

  // Gets the camera's view matrix
  getView() {
    var view = this.mat4.create()
    this.mat4.identity(view)
    this.mat4.rotateY(view, view, -this.shift)
    this.mat4.translate(view, view, [0, 0.0, -this.distance])
    this.mat4.rotateX(view, view, this.rotationY + this.additionalRotationY)
    this.mat4.rotateY(view, view, this.rotationX + this.additionalRotationX)
    this.mat4.translate(view, view, [-this.poi[0], -this.poi[1], -this.poi[2]])
    return view
  }

  // Gets the cameras projection matrix
  getProjection(aspect: number) {
    var fH = Math.tan(this.fov / 360 * Math.PI) * this.nearPlane
    var fW = fH * aspect
    return this.mat4.frustum(this.mat4.create(), -fW, fW, -fH, fH, this.nearPlane, this.farPlane > 0 ? this.farPlane : this.distance * 2)
  }

  // Per frame update
  update(dt) {
    this.rotationX += this._rotationSpeedX * dt
    this._rotationSpeedX *= 0.9
    this.rotationY += this._rotationSpeedY * dt
    this._rotationSpeedY *= 0.9
    if (this.rotationY < -Math.PI / 2) {
      this.rotationY = -Math.PI / 2
    }
    if (this.rotationY > Math.PI / 2) {
      this.rotationY = Math.PI / 2
    }
    if (this.shiftStage === 2) {
      this.shift += this.shift * dt * 5
      if (Math.abs(this.shift) > 2) {
        this.onShift(1, this.shift > 0)
        // this.shift = -this.shift
        // this._shiftOut = false
      }
    }
    else if (this.shiftStage === 1) {
      this.shift -= this.shift * Math.min(dt, 0.5) * 2
    }
  }

  // Drag start handler
  _DragStart (event: any) {
    if (!event.touches && !this.onShift && event.button !== 0) {
      return
    }
    if (this._moveEvent || this._upEvent) {
      return
    }

    if (this._moveEvent === null) {
      document.addEventListener('mousemove', this._moveEvent = (e) => this._DragMove(e), true)
      document.addEventListener('touchmove', this._moveEvent, true)
    }
    if (this._upEvent === null) {
      document.addEventListener('mouseup', this._upEvent = (e) => this._DragStop(e), true)
      document.addEventListener('touchend', this._upEvent, true)
    }
    event.preventDefault()
    if (event.touches) {
      event.screenX = event.touches[0].screenX
      event.screenY = event.touches[0].screenY
    }
    this._dragX = event.screenX
    this._dragY = event.screenY
    this._shiftX = null
    this._rotationSpeedX = 0
    this._lastRotationX = this.rotationX
    this._rotationSpeedY = 0
    this._lastRotationY = this.rotationY
    this._measureRotation = setTimeout(() => this._MeasureRotation(), 500)
  }

  // Measures rotation
  private _MeasureRotation() {
    this._lastRotationX = this.rotationX
    this._lastRotationY = this.rotationY
    this._measureRotation = setTimeout(() => this._MeasureRotation(), 500)
  }

  // Drag move handler
  private _DragMove(event: any) {
    var device = this.ccpwgl_int.device

    if (this.onShift && (event.touches && event.touches.length > 2 || !event.touches && event.button != 0)) {
      this.shiftStage = 0
      event.preventDefault()
      if (event.touches) {
        event.screenX = 0
        event.screenY = 0
        for(var i = 0; i < event.touches.length; ++i) {
          event.screenX += event.touches[i].screenX
          event.screenY += event.touches[i].screenY
        }
        event.screenX /= event.touches.length
        event.screenY /= event.touches.length
      }
      if (this._shiftX !== null) {
        this.shift += (event.screenX - this._shiftX) / device.viewportWidth * 2
      }
      this._shiftX = event.screenX
      return
    }
    this._shiftX = null
    if (event.touches) {
      if (event.touches.length > 1) {
        event.preventDefault()
        var dx = event.touches[0].screenX - event.touches[1].screenX
        var dy = event.touches[0].screenY - event.touches[1].screenY
        var scale = Math.sqrt(dx * dx + dy * dy)
        if (this._prevScale != null) {
          var delta = (this._prevScale - scale) * 0.03
          this.distance = this.distance + delta * this.distance * 0.1
          if (this.distance < this.minDistance) {
            this.distance = this.minDistance
          }
          if (this.distance > this.maxDistance) {
            this.distance = this.maxDistance
          }
        }
        this._prevScale = scale
        return
      }
      event.screenX = event.touches[0].screenX
      event.screenY = event.touches[0].screenY
    }
    if (typeof (event.screenX) !== 'undefined') {
      var dRotation = (-(this._dragX - event.screenX) * 1e-8 * this.rotationSensitivity) * this.distance
      this.rotationX += dRotation
      this._dragX = event.screenX 
      dRotation = (-(this._dragY - event.screenY) * 1e-8 * this.rotationSensitivity) * this.distance
      this.rotationY += dRotation
      this._dragY = event.screenY
      if (this.rotationY < -Math.PI / 2) {
        this.rotationY = -Math.PI / 2
      }
      if (this.rotationY > Math.PI / 2) {
        this.rotationY = Math.PI / 2
      }
    }
  }

  // Drag stop handler
  _DragStop(event: any) {
    clearTimeout(this._measureRotation)
    document.removeEventListener('mousemove', this._moveEvent, true)
    document.removeEventListener('mouseup', this._upEvent, true)
    document.removeEventListener('touchmove', this._moveEvent, true)
    document.removeEventListener('touchend', this._upEvent, true)
    this._moveEvent = null
    this._upEvent = null
    var dRotation = this.rotationX - this._lastRotationX
    this._rotationSpeedX = dRotation * 0.5
    dRotation = this.rotationY - this._lastRotationY
    this._rotationSpeedY = dRotation * 0.5
    this._prevScale = null
    if (this.onShift) {
      if (Math.abs(this.shift) > 0.5) {
        this.shiftStage = 2
        this.onShift(0, this.shift > 0)
      }
      else {
        this.shiftStage = 1
      }
    }
  }

  // Mouse wheel handler
  _WheelHandler(event: any, element: HTMLElement) {
    var delta = 0
    if (!event) // For IE
      event = window.event
    var source = null
    if (event.srcElement) {
      source = event.srcElement
    }
    else {
      source = event.target
    }
    if (source !== element) {
      return false
    }
    if (event.wheelDelta) { // IE/Opera
      delta = event.wheelDelta / 120
      // In Opera 9, delta differs in sign as compared to IE.
      if (window['opera'])
        delta = -delta
    }
    else if (event.detail) { // Mozilla case
      // In Mozilla, sign of delta is different than in IE.
      // Also, delta is multiple of 3.
      delta = -event.detail / 3
    }
    // If delta is nonzero, handle it.
    // Basically, delta is now positive if wheel was scrolled up,
    // and negative, if wheel was scrolled down.
    if (delta) {
      this.distance = this.distance + delta * this.distance * 0.1
      if (this.distance < this.minDistance) {
        this.distance = this.minDistance
      }
      else if (this.distance > this.maxDistance) {
        this.distance = this.maxDistance
      }
    }
    // Prevent default actions caused by mouse wheel.
    // That might be ugly, but we handle scrolls somehow
    // anyway, so don't bother here..
    if (event.preventDefault)
      event.preventDefault()
    event.returnValue = false
    return false
  }
}


export function createCamera(canvas, options, setAsCurrent, ccpwgl_int: any, ccpwgl: any) {

  const get = (src, srcAttr, defaultValue) => src && srcAttr in src ? src[srcAttr] : defaultValue

  var camera = new Camera(canvas, ccpwgl_int);
  camera.fov = get(options, 'fov', 30);
  camera.distance = get(options, 'distance', 1000);
  camera.maxDistance = get(options, 'maxDistance', 1000000);
  camera.minDistance = get(options, 'minDistance', 0.6);
  camera.rotationX = get(options, 'rotationX', 0);
  camera.rotationY = get(options, 'rotationY', 0);
  ccpwgl_int.math.vec3.copy(camera.poi, get(options, 'poi', [0, 0, 0]));
  camera.nearPlane = get(options, 'nearPlane', 1);
  camera.farPlane = get(options, 'farPlane', 1000000);
  camera.rotationSensitivity = get(options, 'rotationSensitivity', 1);

  if (setAsCurrent) {
    ccpwgl.setCamera(camera);
  }

  return camera;
}