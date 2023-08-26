<script lang="ts">
  import NavDrawer from "../medium/NavDrawer.svelte";
  import { redirect } from "@lib/router";
  import PlanetCard from "../medium/PlanetCard.svelte";
  import user from "@lib/resources/userData/store";
  import planets from "@lib/resources/planetsSetup/store";

  export let id: string = ''

  $: if(!$user.installations.includes(id)) {
    redirect(location.origin + '/app/installations/' + $user.installations[0])
  }
</script>


<main class="main">
  <NavDrawer currentInstallationId={id} />
  <section class="main__planets">
    <div class="main__planets-grid">
      {#each Object.values($planets) as planet}
        <PlanetCard setupId={planet.setup_id} />
      {/each}
    </div>
  </section>
</main>
  

<style lang="scss">
  @import '../../scss/var';

  .main {
    background: $background0;
    width: 100%;
    height: 100vh;
    display: flex;

    &__planets {
      width: 100%;
      height: 100%;
      overflow-x: auto;
    }
    &__planets-grid {
      padding: 48px;
      box-sizing: border-box;
      width: 100%;
      height: max-content;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      grid-template-rows: max-content;
      gap: 32px;
    }
  }
</style>