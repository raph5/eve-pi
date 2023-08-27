<script lang="ts">
  import { view } from '@lib/router';
  import NotificationDispenser from './components/medium/NotificationDispenser.svelte';
</script>


<NotificationDispenser />
<svelte:component this={$view.component} {...$view.props} />


<style lang="scss" global>
  @import './scss/global.scss';
</style>