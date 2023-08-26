<script lang="ts">
  import { view } from '@lib/router';
</script>


<svelte:component this={$view.component} {...$view.props} />


<style lang="scss" global>
  @import './scss/global.scss';
</style>