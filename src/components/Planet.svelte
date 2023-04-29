
<canvas id="planetCanvas"></canvas>


<script lang="ts">
import { onMount } from "svelte"
import { initPlanet } from "../lib/planet"


// import asynchronously ccpwgl_int module
const ccpwglPromise = import('../lib/ccpwgl/ccpwgl_int.js')
  .then(() => import('../lib/ccpwgl/ccpwgl.js'))
  .then(i => i.default);


// setup canvas HTML element
onMount(() => {
  
  const canvas = document.getElementById('planetCanvas') as HTMLCanvasElement

  // resize the canvas to screen size
  function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio ?? 1
    canvas.setAttribute('height', Math.ceil(window.innerHeight / pixelRatio).toString())
    canvas.setAttribute('width', Math.ceil(window.innerWidth / pixelRatio).toString())
  }
  
  // setup canvas size
  resizeCanvas()
  
  // resize canvas on screen resize
  let _lastResize = Date.now()
  let _timeOutResize
  window.addEventListener('resize', () => {
    const now = Date.now()
    const _dif = now - _lastResize
    if(_dif > 500) {
      resizeCanvas()
      _lastResize = now
    }
    else {
      if(_timeOutResize) {
        clearTimeout(_timeOutResize)
      }
      _timeOutResize = setTimeout(resizeCanvas, 500 - _dif)
    }
  })

  // setup planet
  ccpwglPromise.then(ccpwgl => initPlanet(canvas, ccpwgl))

})

</script>