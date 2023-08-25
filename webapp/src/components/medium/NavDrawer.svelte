<script lang="ts">
  import type { Installation } from "@lib/eveApi/installation";
  import user from "@lib/stores/user";

  export let curentInstallation: Installation;
</script>


<nav class="nav">

  <div class="installation-data">
    <div class="installation-data__main-char">
      <img src={$user.getImg(32)} alt="{$user.name}'s profile picture">
      <span>{$user.name}</span>
    </div>
  </div>

  <ul class="nav__ul">
    {#each Object.values($user.installations) as inst}
      {@const active = inst.id == curentInstallation.id}
      <li class="nav__li">
        <a class="nav__button {active ? 'nav__button--active' : ''} button" href="/app/installation/{inst.id}">
          <span class="nav__button-icon material-symbols-rounded">factory</span>
          <span class="nav__button-label">{inst.name}</span>
        </a>
      </li>
    {/each}
  </ul>

  <!-- TODO: replace by <hr> -->
  <div class="nav__spacer"></div>

  <!-- TODO: add installation creation popup -->
  <button class="nav__button">
    <span class="nav__button-icon material-symbols-rounded">add</span>
    <span class="nav__button-label">Create new installation</span>
  </button>

</nav>


<style lang="scss">
  @import '../../scss/var';

  .nav {
    flex: 1;
    height: 100%;
    width: 220px;
    min-width: 220px;
    background: $background1;
    padding: 32px 16px;
    overflow-y: auto;
    color: $font-color;

    &__ul {
      padding: 0;
      margin: 0;
    }
    &__li {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    &__spacer {
      width: calc(100% - 16px * 2);
      height: 1px;
      margin: 8px 16px;
      // TODO: use a color variable
      background: #fff1;
    }
    &__button {
      display: block;
      box-sizing: border-box;
      width: 100%;
      margin: 8px 0;
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: none;
      gap: 8px;
      color: $font-color;
      cursor: pointer;
      @include label;
      

      &--active {
        @include solid;
      }
      &:hover {
        color: $primary;
      }
      &--active:hover {
        color: $font-color;
      }
    }
    &__button-icon {
      font-size: 20px;
    }
  }

  .installation-data  {
    margin-top: 16px;
    margin-bottom: 86px;
    padding: 0 16px;
    
    &__main-char {
      display: flex;
      align-items: flex-end;

      img {
        border-radius: 8px;
      }
      span {
        @include header2;
        margin-bottom: 2px;
        margin-left: 8px;
      }
    }
  }
</style>