<script lang="ts">
  import user from "@lib/resources/userData/store";
  import Modal from "../medium/Modal.svelte";
  import { characterImg } from "@utils/ui";
  import IconButton from "../small/IconButton.svelte";
  import Button from "../small/Button.svelte";
  import { getSsoUrl } from "@lib/sso/sso";
  import notifications from "@lib/notifications";
  import type { Character } from "@lib/resources/userData/factory";

  export let showModal: boolean

  function addCharacter() {
    location.href = getSsoUrl(location.pathname)
  }

  let removalInProcess = new Set<number>()
  async function removeCharacter(character: Character) {
    removalInProcess.add(character.id)
    removalInProcess = removalInProcess

    try {
      await user.removeAlt(character.name)
      notifications.push(`Character "${character.name}" removed`, 'info')
    }
    catch(e) {
      console.log(e)
      notifications.push(`Error while removing character "${character.name}"`, 'error')
    }

    removalInProcess.delete(character.id)
    removalInProcess = removalInProcess
  }
</script>


<Modal
  bind:showModal
  title="User settings"
  cancelButton="cancel"
  saveButton="save"
>
  <div class="list__parent">
    <span class="label">Character List</span>
    <ul class="list">
      <li class="list__li">
        <img class="list__img" src={characterImg($user.id)} alt="{$user.name} profile picture">
        <span class="list__name">{$user.name}</span>
        <span class="list__tag list__tag--main">main</span>
      </li>
      {#each $user.alts as char}
        <li class="list__li">
          <img class="list__img" src={characterImg(char.id)} alt="{char.name} profile picture">
          <span class="list__name">{char.name}</span>
          <span class="list__tag">alt</span>
          <IconButton
            style="transparent"
            icon="delete"
            loading={removalInProcess.has(char.id)}
            on:click={() => removeCharacter(char)}
          />
        </li>
      {/each}
    </ul>
    <Button style="bg-3" text="Add a character" icon="add" on:click={addCharacter} />
  </div>
</Modal>


<style lang="scss">
  @import '../../scss/var.scss';

  .list {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__li {
      @include solid($bg-3, 5);
      margin: 0;
      width: 100%;
      padding: 8px;
      list-style: none;
      box-sizing: border-box;
      background: $bg-3;
      border-radius: 8px;
      display: flex;
      align-items: center;
    }
    &__img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }
    &__name {
      @include header2;
      margin-left: 8px;
    }
    &__tag {
      @include tag;
      padding: 0 5px;
      border-radius: 4px;
      margin-left: 16px;
      background: $secondary;
      color: $font-dark;
      
      &--main {
        background: $primary;
        color: $font-light;
      }
    }
    :global(.icon-button) {
      margin-left: auto;
    }
    &__parent :global(.button) {
      margin: 0 auto;
      margin-top: 32px;
    }
  }
</style>