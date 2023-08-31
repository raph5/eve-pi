<script lang="ts">
  import type View from "@lib/threejs/planetView/view"
  import type { PlanetSetup } from "@lib/resources/planetsSetup/factory";
  import { onDestroy, onMount } from "svelte";
  import { createPlanet } from "@lib/threejs/planets";

  export let view: View
  export let setup: PlanetSetup

  let planet
  
  onMount(() => {
    planet = createPlanet(setup.planet_type, view.time)
    view.scene.add(planet)
  })
  onDestroy(() => {
    view.scene.remove(planet)
  })
</script>