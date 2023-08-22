<script lang="ts">
  import type { Installation } from "@lib/eveApi/installation";
  import type { UserData } from "@lib/user";
  import NavDrawer from "../medium/NavDrawer.svelte";
  import { redirect } from "@lib/router";

  export let user: UserData
  export let id: string = ''

  $: console.log(user.installations[id])

  let installation: Installation
  $: if(user.installations[id]) {
    installation = user.installations[id]
  } else {
    redirect(location.origin + '/app/installations/' + Object.values(user.installations)[0].id)
  }
</script>


<main class="main">
  <NavDrawer {user} {installation} />
</main>


<style lang="scss">
  @import '../../scss/var';

  .main {
    background: $background0;
    width: 100%;
    height: 100vh;
  }
</style>