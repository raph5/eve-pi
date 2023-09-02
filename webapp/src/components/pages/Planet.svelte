<script lang="ts">
  import planets from "@lib/resources/planetsSetup/store";
  import PlanetView from "../threejs/PlanetView.svelte";
  import { redirect } from "@lib/router";
  import View from "@lib/threejs/planetView/view";
  import { onDestroy, onMount } from "svelte";
  import PlanetPin from "../threejs/PlanetPin.svelte";

  export let id: string

  $: if(!$planets[id]) {
    redirect(location.origin + '/app/installations')
  }

  let canvas: HTMLCanvasElement
  let view: View

  onMount(() => {

    // setup planet
    view = new View(canvas, {
      width: window.innerWidth,
      height: window.innerHeight
    })
    
    // resize canvas on screen resize
    const resize = () => view.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', resize)

  })
  
  onDestroy(() => {
    if(view) view.destroy()
  })
</script>


<main class="main">
  <canvas class="planet-canvas" bind:this={canvas}></canvas>

  {#if view}
    <PlanetView {view} setup={$planets[id]} />
    {#each $planets[id].layout.pins as pin}
      <PlanetPin {view} pinData={pin} />
    {/each}
  {/if}
</main>


<style lang="scss">
  @import '../../scss/var';

  .main {
    width: 100%;
    height: 100vh;

    :global(.planet-canvas) {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>