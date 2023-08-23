<script lang="ts">
  import Loading from './components/views/Loading.svelte';
  import userStore from '@lib/stores/user';
  import Error from './components/medium/Error.svelte';
  import { view } from '@lib/router';
  import LandingPage from './components/views/LandingPage.svelte';
</script>


{#await $userStore}
  <Loading />
{:then user}
  <svelte:component this={$view.component} {...$view.props} {user} />
  {:catch}
  {#if $view.component == LandingPage}
    <LandingPage />
  {:else}
    <Error message="user not loged" redirection={location.origin + '/?loginerror'} />
  {/if}
{/await}


<style lang="scss" global>
  @import './scss/global.scss';
</style>