<div class="loading">
  <div class="loading__spinner"></div>
</div>


<style lang="scss">
  @import '../../scss/var';

  .loading {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &__spinner {
      width: 16px;
      height: 16px;
      border: solid $font-light;
      border-width: 0 0 2px 2px;
      border-radius: 50%;
      animation: spin 500ms infinite linear;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>