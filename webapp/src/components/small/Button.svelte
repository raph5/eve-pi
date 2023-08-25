<script lang="ts">
  type buttonStyle = 'solid'

  export let style: buttonStyle = 'solid'
  export let icon: string = ''
  export let text: string
</script>


<button class="button button--{style}" on:click>
  {#if icon}
    <span class="button__icon material-symbols-rounded">{icon}</span>
  {/if}
  <span class="button__text">{text}</span>
</button>


<style lang="scss">
  @import '../../scss/var.scss';

  .button {
    @include button-reset;
    color: $font-color;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 8px;
    gap: 4px;
    cursor: pointer;
    
    &--solid {
      @include solid-button;
    }

    &__icon {
      font-size: 20px;
    }
    &__text {
      @include label;
    }
  }
</style>