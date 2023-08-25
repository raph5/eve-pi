<script lang="ts">
  import type { Installation } from "@lib/eveApi/installation";
  import NavDrawer from "../medium/NavDrawer.svelte";
  import { redirect } from "@lib/router";
  import installationStore from "@lib/stores/installation";
  import PlanetCard from "../medium/PlanetCard.svelte";
  import user from "@lib/stores/user";

  export let id: string = ''

  let curentInstallation: Installation
  $: if($user.installations[id]) {
    curentInstallation = $user.installations[id]
  } else {
    redirect(location.origin + '/app/installations/' + Object.values($user.installations)[0].id)
    curentInstallation = $user.installations[id]
  }
  
</script>


<main class="main">
  {#if curentInstallation}
    <NavDrawer {curentInstallation} />
    <section class="main__planets">
      <div class="main__planets-grid">
        {#await $installationStore then store}
          {#await store[curentInstallation.id] then installation}
            {#each installation[$user.name].planets as planetData}
              <PlanetCard {planetData} />
            {/each}
          {/await}
        {/await}
      </div>
    </section>
  {/if}
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