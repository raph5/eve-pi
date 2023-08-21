
<canvas id="planetCanvas"></canvas>


<script lang="ts">
import { onMount } from "svelte"
import { initView } from "@lib/planetView/index"


// setup canvas HTML element
onMount(() => {

  // get canvas
  const canvas = document.getElementById('planetCanvas') as HTMLCanvasElement

  // setup planet
  const view = initView(canvas, {
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  // resize canvas on screen resize
  const resize = () => view.setSize(window.innerWidth, window.innerHeight)
  let _lastResize = Date.now()
  let _timeOutResize
  window.addEventListener('resize', () => {
    const now = Date.now()
    const _dif = now - _lastResize
    if(_dif > 500) {
      resize()
      _lastResize = now
    }
    else {
      if(_timeOutResize) {
        clearTimeout(_timeOutResize)
      }
      _timeOutResize = setTimeout(resize, 500 - _dif)
    }
  })

})

</script>