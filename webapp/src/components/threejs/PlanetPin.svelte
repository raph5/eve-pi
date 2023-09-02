<script lang="ts">
  import type { Pin as PinData } from "@lib/resources/planetsSetup/esi";
  import Spaceport from "@lib/threejs/pin/spaceport";
  import type View from "@lib/threejs/planetView/view";
  import { onDestroy, onMount } from "svelte";

  export let view: View
  export let pinData: PinData

  let spaceport: Spaceport

  onMount(() => {
    spaceport = new Spaceport(pinData)
    view.scene.add(spaceport)
  })
  onDestroy(() => {
    view.scene.remove(spaceport)
  })
</script>