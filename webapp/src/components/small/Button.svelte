<script lang="ts">
    import LoadingIcon from "./LoadingIcon.svelte";

  type buttonStyle = 'primary' | 'bg-3' | 'bg-4' | 'unfiorm' | 'transparent'

  export let style: buttonStyle = 'primary'
  export let icon: string = ''
  export let text: string
  export let loading = false
</script>


<button class="button button--{style}" on:click>
  {#if loading}
    <LoadingIcon />
  {:else if icon}
    <span class="button__icon material-symbols-rounded">{icon}</span>
  {/if}
  <span class="button__text">{text}</span>
</button>


<style lang="scss">
  @import '../../scss/var.scss';

  .button {
    @include button-reset;
    background: $bg-3;
    color: $font-light;
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    border-radius: 8px;
    gap: 4px;
    outline: none;
    cursor: pointer;
    
    &--transparent, &--uniform {
      color: $font-med;
      
      &:hover, &:focus, &:active {
        color: $font-light;
      }
    }
    &--transparent {
      background: transparent;
    }
    &--primary {
      @include solid($primary, 15);
      
      &:hover, &:focus, &:active {
        @include solid(lighten($primary, 10), 15);
      }
    }
    &--bg-3 {
      @include solid($bg-3);
      
      &:hover, &:focus, &:active {
        @include solid(lighten($bg-3, 10));
      }
    }
    &--bg-4 {
      @include solid($bg-4, 5);
      
      &:hover, &:focus, &:active {
        @include solid(lighten($bg-4, 10));
      }
    }

    &__icon {
      font-size: 20px;
    }
    &__text {
      @include label;
    }
  }
</style>