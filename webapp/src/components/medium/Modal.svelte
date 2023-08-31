<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "../small/Button.svelte";
  
	const dispatch = createEventDispatcher();

	export let showModal: boolean
  export let title: string
  export let saveButton = ''
  export let cancelButton = 'close'

	let dialog: HTMLDialogElement;
  $: if (dialog && showModal) dialog.showModal();

  function save() {
    dialog.close()
    dispatch('save')
  }
  function cancel() {
    dialog.close()
    dispatch('cancel')
  }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => showModal = false}
  class="modal"
>
  <div class="modal__header">
    <h1 class="modal__title">{title}</h1>
  </div>

  <div class="modal__body">
    <slot />
  </div>

  <div class="modal__footer">
    {#if saveButton}
      <Button
        on:click={() => save()}
        icon="done"
        text={saveButton}
        style="primary"
      />
    {/if}
    {#if cancelButton}
      <Button
        on:click={() => cancel()}
        text={cancelButton}
        style="bg-3"
      />
    {/if}
  </div>
</dialog>


<style lang="scss">
  @import '../../scss/var';

  .modal {
    border: none;
    border-radius: 8px;
    background: $bg-2;
    min-width: 700px;
    max-width: 90%;
    min-height: 300px;
    max-height: 80%;
    display: flex;
    visibility: hidden;
    flex-direction: column;
    margin-top: 100px;
    box-shadow: 0 0 40px #0006;
    color: $font-light;
    cursor: default;
    padding: 0;
    opacity: 0;
    transform: translateY(-70px);
    transition: opacity 200ms, transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &__header {
      padding: 16px;
      border-bottom: solid 1px $bg-3;
    }
    &__title {
      margin: 0;
    }
    &__body {
      padding: 16px;
      height: 100%;
    }
    &__footer {
      padding: 16px;
      display: flex;
      flex-direction: row-reverse;
      gap: 8px;
      margin-top: auto;
      border-top: solid 1px $bg-3;
    }

    hr {
      background: $bg-3;
    }

    &::backdrop {
      background: #0006;
      opacity: 0;
      transition: opacity 300ms;
    }
    
    &[open] {
      visibility: visible;
      opacity: 1;
      transform: none;
      
      &::backdrop {
        opacity: 1;
      }
    }
  }
</style>