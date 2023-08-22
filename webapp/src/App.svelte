<script lang="ts">
  import Loading from './components/views/Loading.svelte';
  import userStore from '@lib/stores/user';
  import Error from './components/medium/Error.svelte';
  import { view } from '@lib/router';
</script>


{#await $userStore}
  <Loading />
{:then user}
  <svelte:component this={$view.component} {...$view.props} {user} />
{:catch}
  <Error message="user not loged" redirection={location.origin + '/?loginerror'} />
{/await}


<style lang="scss" global>
  @import './scss/global.scss';
</style>