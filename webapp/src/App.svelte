<script lang="ts">
  import { view } from '@lib/router';
  import AuthErrorPage from './components/pages/AuthErrorPage.svelte';

  let authError = false
  window.onunhandledrejection = (ev: PromiseRejectionEvent) => {
    const error = ev.reason as Error
    if(error.name === 'AuthError') {
      authError = true
    }
  }
</script>


{#if authError}
  <AuthErrorPage />
{:else}
  <svelte:component this={$view.component} {...$view.props} />
{/if}


<style lang="scss" global>
  @import './scss/global.scss';
</style>