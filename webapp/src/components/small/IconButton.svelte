<script lang="ts">
    import LoadingIcon from "./LoadingIcon.svelte";

  type buttonStyle = 'primary' | 'bg-3' | 'bg-4' | 'unfiorm' | 'transparent'

  export let style: buttonStyle = 'primary'
  export let icon: string
  export let loading = false
</script>


<button class="icon-button icon-button--{style}" on:click disabled={loading}>
  {#if loading}
    <LoadingIcon />
  {:else}
    <span class="icon-button__icon material-symbols-rounded">{icon}</span>
  {/if}
</button>


<style lang="scss">
  @import '../../scss/var.scss';

  .icon-button {
    @include button-reset;
    background: $bg-3;
    border-radius: 8px;
    width: 32px;
    height: 30px;
    margin: 1px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $font-light;
    outline: none;
    cursor: pointer;

    &__icon {
      font-size: 20px;
    }
    
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
      @include solid($bg-4, 8);
      
      &:hover, &:focus, &:active {
        @include solid(lighten($bg-4, 10));
      }
    }
  }
</style>