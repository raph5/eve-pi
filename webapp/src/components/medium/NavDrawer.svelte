<script lang="ts">
  import user from "@lib/resources/userData/store";
  import installations from "@lib/resources/installations/store";
  import { characterImg } from "@utils/ui";
  import UsersSettings from "../modals/UsersSettings.svelte";
  import IconButton from "../small/IconButton.svelte";

  export let currentInstallationId: string;
  
  let showSettingsModal = false
</script>


<nav class="nav">

  <div class="user">
    <div class="user__main-char">
      <img src={characterImg($user.id)} alt="{$user.name}'s profile picture">
      <span>{$user.name}</span>
    </div>
    <IconButton style="bg-3" icon="settings" on:click={() => showSettingsModal = true} />
  </div>

  <div class="nav__nav">
    <ul class="nav__ul">
      {#each Object.values($user.installations) as installationsId}
        {@const active = installationsId == currentInstallationId}
        <li class="nav__li">
          <a class="nav__button {active ? 'nav__button--active' : ''} button" href="/app/installation/{$installations[installationsId].id}">
            <span class="nav__button-icon material-symbols-rounded">factory</span>
            <span class="nav__button-label">{$installations[installationsId].name}</span>
          </a>
        </li>
      {/each}
    </ul>

    <hr class="nav__spacer">

    <!-- TODO: add installation creation popup -->
    <button class="nav__button">
      <span class="nav__button-icon material-symbols-rounded">add</span>
      <span class="nav__button-label">Add Installation</span>
    </button>
  </div>

</nav>

<UsersSettings bind:showModal={showSettingsModal} />


<style lang="scss">
  @import '../../scss/var';

  .nav {
    flex: 1;
    height: 100%;
    width: 220px;
    min-width: 250px;
    background: $bg-1;
    color: $font-light;

    &__nav {
      padding: 0 16px;
      overflow-y: auto;
      height: 100%;
      box-sizing: border-box;
    }
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
      margin: 8px 16px;
      background: #ffffff15;
    }
    &__button {
      outline: none;
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
      color: $font-med;
      cursor: pointer;
      @include label;
      

      &--active {
        @include solid;
        color: $font-light;
      }
      &:hover {
        color: $font-light;
      }
    }
    &__button-icon {
      font-size: 20px;
    }
  }

  .user  {
    @include solid($bg-2);
    margin-bottom: 32px;
    padding: 16px;
    padding-top: 64px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;
    grid-template-areas: "main-char settings";
    
    &__main-char {
      grid-area: main-char;
      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
      span {
        @include header2;
        width: 100%;
        overflow: hidden;
        margin-left: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &__settings {
      grid-area: settings;
      background: none;
      border: none;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $font-light;
      border-radius: 8px;
      
      span {
        font-size: 20px;
      }
      &:hover {
        color: $primary;
      }
    }
  }
</style>