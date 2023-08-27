<script lang="ts">
  export let value: string
</script>


<input class="input" type="text" bind:value>


<style lang="scss">
  @import '../../scss/var.scss';

  .input {
    @include paragraph;
    background: $bg-1;
    border: solid 1px $bg-3;
    border-radius: 8px;
    padding: 6px;
    color: $font-light;
  }
</style>