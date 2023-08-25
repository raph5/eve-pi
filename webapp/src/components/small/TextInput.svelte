<script lang="ts">
  export let name: string
  export let value: string
  export let showLabel = false
</script>


{#if showLabel}
  <label class="input__label">
    <span class="input__label-text">{name}</span>
    <input class="input" type="text" bind:value {name}>
  </label>
{:else}
  <input class="input" type="text" bind:value {name}>
{/if}


<style lang="scss">
  @import '../../scss/var.scss';

  .input {
    @include paragraph;
    background: transparent;
    border: solid 1px $background3;
    border-radius: 8px;
    padding: 6px;
    color: $font-color;

    &__label-text {
      display: block;
      @include label;
      margin-bottom: 6px;
    }
  }
</style>