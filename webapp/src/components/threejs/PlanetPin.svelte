<script lang="ts">
  import type { Pin as PinData } from "@lib/resources/planetsSetup/esi";
  import { createPin } from "@lib/threejs/pin";
  import type Pin from "@lib/threejs/pin/pin";
  import type View from "@lib/threejs/planetView/view";
  import { onDestroy, onMount } from "svelte";

  export let view: View
  export let pinData: PinData

  let pin: Pin

  onMount(() => {
    pin = createPin(pinData, view.time)
    view.scene.add(pin)
  })
  onDestroy(() => {
    view.scene.remove(pin)
  })
</script>